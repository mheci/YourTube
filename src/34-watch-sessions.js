// The visit object is the cancellation token. No async result may act on a different
// visit or player. A media element is never the identity of a YouTube SPA route.
const WatchSessions = (() => {
  let hooks = null,
    observer = null,
    timer = 0,
    current = null,
    retired = null,
    busy = false,
    suspended = false,
    queued = false;
  const finite = Number.isFinite,
    noop = () => {},
    tick = () => performance.now();
  const mainSelector = '#movie_player, #shorts-player, .html5-video-player';
  function route() {
    const u = new URL(location.href),
      part = u.pathname.match(/^\/(?:shorts|live|embed)\/([\w-]{11})(?:\/|$)/);
    const id = u.pathname === '/watch' ? u.searchParams.get('v') : part?.[1];
    const hash = new URLSearchParams(u.hash.slice(1));
    const explicit = ['t', 'start', 'time_continue'].some((k) =>
      [u.searchParams.get(k), hash.get(k)].some(
        (v) => v !== null && /^(?:\d+(?:\.\d+)?s?|(?=\d)(?:\d+h)?(?:\d+m)?(?:\d+s)?)$/i.test(v),
      ),
    );
    return { id: CheckpointStore.validId(id) ? id : null, explicit };
  }
  function provider(host) {
    try {
      return host.getVideoData?.() || {};
    } catch (_) {
      return {};
    }
  }
  const noticeSelector =
    'yt-playability-error-supported-renderers,ytm-playability-error-supported-renderers,ytd-player-error-message-renderer,ytm-player-error-message-renderer,.ytp-error-content-wrap';
  function nativeNotice(player, owner) {
    // Some watch layouts render the notice BESIDE a hidden #movie_player.
    // Never take focus from the site's sign-in, age, rights or error UI.
    const notices = document.querySelectorAll(noticeSelector);
    for (const n of notices) {
      if (
        !n.getClientRects().length ||
        !n.textContent.trim() ||
        getComputedStyle(n).visibility === 'hidden'
      )
        continue;
      if (player.contains(n) || (owner && owner.contains(n))) return true;
      const box = n.getBoundingClientRect(),
        other = player.getBoundingClientRect();
      if (
        box.width > 0 &&
        box.height > 0 &&
        Math.min(box.right, other.right) > Math.max(box.left, other.left) &&
        Math.min(box.bottom, other.bottom) > Math.max(box.top, other.top)
      )
        return true;
    }
    return false;
  }
  function candidate(s) {
    for (const p of document.querySelectorAll(mainSelector)) {
      if (p.closest('[hidden], ytd-miniplayer, ytd-video-preview, ytd-moving-thumbnail-renderer'))
        continue;
      const video = p.querySelector('video.html5-main-video') || p.querySelector('video');
      if (!video || !p.getClientRects().length) continue;
      const data = provider(p),
        owner = p.closest('ytd-watch-flexy,ytd-watch-grid,ytm-watch,ytd-reel-video-renderer');
      const identity = data.video_id || owner?.getAttribute('video-id');
      if (identity && identity !== s.id) continue;
      // Without a provider ID a reused element is not proof of a new source.
      if (
        !identity &&
        retired?.id !== s.id &&
        retired?.v === video &&
        retired.src === video.currentSrc &&
        !s.reloaded.has(video)
      )
        continue;
      const live =
        video.duration === Infinity ||
        data.isLive === true ||
        !!Array.from(p.querySelectorAll('.ytp-live-badge')).find((n) => n.getClientRects().length);
      if (
        live ||
        p.matches('.ad-showing,.ad-interrupting,.ytp-error') ||
        video.error ||
        nativeNotice(p, owner)
      )
        continue;
      return { v: video, p };
    }
    return null;
  }
  function belongs(s) {
    return hooks && !suspended && current === s && S.sessionRestoreOn && route().id === s.id;
  }
  function locked(s) {
    return (
      !!s &&
      ((s.phase === 'lookup' && s.ask) ||
        ['hold', 'shortened', 'seeking', 'seek-error', 'play-blocked'].includes(s.phase))
    );
  }
  function canGuard(s, v) {
    return belongs(s) && locked(s) && candidate(s)?.v === v;
  }
  function releaseGate(s) {
    if (s.unpatch) s.unpatch();
    s.unpatch = null;
  }
  function gate(s) {
    const v = s.v;
    if (!v || !locked(s)) return releaseGate(s);
    if (!s.unpatch) {
      const own = Object.getOwnPropertyDescriptor(v, 'play'),
        prior = v.play;
      const guarded = _xp.fn(function (...args) {
        if (this !== v || !canGuard(s, v)) return prior.apply(this, args);
        if (s.phase === 'lookup') s.wanted = true;
        return _pPromise.reject(
          new DOMException('Choose a playback position in YourTube.', 'AbortError'),
        );
      });
      try {
        Object.defineProperty(v, 'play', { configurable: true, writable: true, value: guarded });
        s.unpatch = () => {
          try {
            if (v.play === guarded) {
              if (own) Object.defineProperty(v, 'play', own);
              else delete v.play;
            }
          } catch (_) {}
        };
      } catch (_) {
        s.unpatch = noop;
      } // Read-only / isolated realm: capture-phase pause remains active.
    }
    if (!v.paused) {
      if (s.phase === 'lookup') s.wanted = true;
      v.pause();
    }
  }
  function clearUI(s) {
    s.ui?.remove();
    s.ui = null;
  }
  function detach(s) {
    if (s.v && s.phase === 'active' && s.last) s.verifySource = true;
    releaseGate(s);
    s.ui?.remove();
    s.v = null;
    s.p = null;
    s.prev = null;
    s.seekSent = false;
  }
  function active(s) {
    s.phase = 'active';
    releaseGate(s);
    clearUI(s);
  }
  function writer(s) {
    if (!s.sid) {
      s.sid = CheckpointStore.nonce();
      s.start = Math.max(Date.now(), (s.row?._checkpoint?.start || 0) + 1);
    }
  }
  function metadata(s) {
    const data = provider(s.p);
    let details;
    try {
      details = e.ytInitialPlayerResponse?.videoDetails;
    } catch (_) {}
    const pd = details?.videoId === s.id ? details : {};
    return {
      title:
        data.title ||
        pd.title ||
        document.querySelector('ytd-watch-metadata h1, h1.title')?.textContent?.trim() ||
        '',
      channel:
        data.author ||
        pd.author ||
        document.querySelector('#owner ytd-channel-name a,#owner-name a')?.textContent?.trim() ||
        '',
      channelId: data.channel_id || pd.channelId || '',
    };
  }
  function sample(s, kind) {
    const v = s.v;
    if (
      s.readOnly ||
      s.phase !== 'active' ||
      !v ||
      !belongs(s) ||
      candidate(s)?.v !== v ||
      !finite(v.duration) ||
      v.duration <= 0 ||
      !finite(v.currentTime)
    )
      return;
    // A replacement player often reports a perfectly finite paused 0:00. It
    // is not a new stopping point until playback or an actual seek on it.
    if (s.verifySource) {
      if (
        v.seeking ||
        v.readyState < 2 ||
        (v.paused && kind !== 'seeked' && Math.abs(v.currentTime - (s.last?.pos || 0)) > 0.2)
      )
        return;
      s.verifySource = false;
    }
    // A passive visit, a pending choice, an ad or a metadata event is never a view.
    if (!s.sid) {
      if (v.paused || v.ended || !['playing', 'play', 'tick', 'timeupdate'].includes(kind)) return;
      writer(s);
    }
    const now = tick(),
      pos = Math.max(0, Math.min(v.duration, v.currentTime)),
      rate = v.playbackRate || 1;
    const prev = s.prev;
    if (prev?.running && !v.seeking && kind !== 'seeking') {
      const wall = Math.max(0, (now - prev.t) / 1000),
        media = pos - prev.pos;
      if (media > 0 && media <= wall * prev.rate + 0.35)
        s.played += Math.min(wall, media / prev.rate);
    }
    s.prev = { t: now, pos, rate, running: !v.paused && !v.seeking && !v.ended };
    if (v.seeking || kind === 'seeking') return;
    s.last = { pos, dur: v.duration, done: v.ended, meta: metadata(s) };
  }
  function flush(s = current, force = true) {
    if (!s?.last || !s.sid || s.readOnly || (s.phase !== 'active' && s.phase !== 'play-blocked'))
      return Promise.resolve(false);
    const z = s.last,
      signature = [z.pos, z.dur, z.done, Math.floor(s.played * 10)].join('/');
    if (signature === s.sent || (!force && tick() - s.lastWrite < 3500))
      return s.job || Promise.resolve(false);
    s.sent = signature;
    s.lastWrite = tick();
    const seq = ++s.seq;
    const snap = {
      ...z,
      id: s.id,
      epoch: s.epoch,
      life: s.life,
      sid: s.sid,
      start: s.start,
      seq,
      at: Date.now(),
      played: s.played,
    };
    s.job = CheckpointStore.commit(snap)
      .then((changed) => {
        if (changed && belongs(s) && !s.signalled && s.played > 0) {
          s.signalled = true;
          try {
            if (typeof YourTubeSession !== 'undefined')
              YourTubeSession.genome?.record({
                topic: z.meta.title,
                duration: z.dur,
                handle: z.meta.channelId,
                channelName: z.meta.channel,
              });
          } catch (_) {}
        }
        if (changed && belongs(s) && S.algoIntelligenceOn && S.algoAutoTrain && typeof AlgoEngine !== 'undefined')
          try {
            AlgoEngine.SignalTracker.trackWatch(s.id, z.pos, z.dur);
          } catch (_) {}
        return changed;
      })
      .catch(() => {
        if (s.seq === seq) s.sent = null;
        warn(s, 'History storage is unavailable. Your last checkpoint will be retried.');
        return false;
      });
    return s.job;
  }
  function warn(s, msg) {
    if (!s.warned && current === s) {
      s.warned = true;
      try {
        pe(msg, 4000, 'info');
      } catch (_) {}
    }
  }
  function safePlay(s, selected) {
    const v = s.v;
    if (!v || !belongs(s)) return;
    function denied() {
      if (selected && belongs(s) && s.v === v && v.paused && s.phase === 'active') {
        s.phase = 'play-blocked';
        sync();
      }
    }
    try {
      const result = v.play();
      result?.catch(denied);
    } catch (_) {
      denied();
    }
  }
  function choose(s, action) {
    if (!belongs(s) || !s.v) return;
    if (
      !['hold', 'seek-error', 'play-blocked'].includes(s.phase) &&
      !(action === 'restart' && ['shortened', 'seeking'].includes(s.phase))
    )
      return;
    if (candidate(s)?.v !== s.v) {
      sync();
      return;
    }
    s.target =
      action === 'restart'
        ? 0
        : s.phase === 'play-blocked' || s.phase === 'seek-error'
          ? s.target
          : s.pos;
    s.phase = 'seeking';
    s.seekSent = false;
    s.deadline = tick() + 8000;
    sync();
  }
  function seek(s) {
    if (tick() > s.deadline) {
      s.phase = 'seek-error';
      return;
    }
    const v = s.v;
    if (!v || v.readyState < 1 || !finite(v.duration) || v.duration <= 0) return;
    if (s.target > 0 && s.target >= v.duration - 0.25) {
      s.phase = 'shortened';
      return;
    }
    const target = Math.max(0, Math.min(s.target, Math.max(0, v.duration - 0.1)));
    if (!v.seeking && Math.abs(v.currentTime - target) <= 0.2) {
      s.target = target;
      active(s);
      writer(s);
      s.prev = null;
      sample(s, 'choice');
      flush(s);
      safePlay(s, true);
      return;
    }
    if (!s.seekSent) {
      s.seekSent = true;
      try {
        v.currentTime = target;
      } catch (_) {
        s.phase = 'seek-error';
      }
    }
  }
  function open(r) {
    const s = {
      id: r.id,
      explicit: r.explicit,
      ask: S.sessionResumeMode !== 'record' && !r.explicit,
      phase: 'lookup',
      v: null,
      p: null,
      ui: null,
      unpatch: null,
      wanted: false,
      row: null,
      sid: null,
      start: 0,
      seq: 0,
      played: 0,
      epoch: '',
      last: null,
      prev: null,
      sent: null,
      lastWrite: -Infinity,
      reloaded: new WeakSet(),
    };
    current = s;
    // Only an UNKNOWN storage lookup has a deadline. A known saved point never
    // unlocks on a timer. Fail open without recording over an unread record.
    const unavailable = () => {
      if (!belongs(s) || s.phase !== 'lookup') return;
      s.readOnly = true;
      active(s);
      if (s.wanted) safePlay(s, false);
      warn(s, 'Could not read local history. Playing normally without replacing your saved place.');
    };
    s.lookupTimer = setTimeout(unavailable, 2600);
    CheckpointStore.load(s.id).then(({ row, epoch, life }) => {
      if (!belongs(s) || s.phase !== 'lookup') return;
      clearTimeout(s.lookupTimer);
      s.row = row;
      s.epoch = epoch;
      s.life = life;
      const dur = Number(row?.duration) || 0,
        raw = Number(row?.lastPosition);
      const legacy =
        !raw && !row?._checkpoint && row?.progress > 1 && row.progress < 100 && dur > 0;
      s.pos = legacy ? (dur * Number(row.progress)) / 100 : raw;
      if (
        s.ask &&
        row &&
        !row.completed &&
        finite(s.pos) &&
        s.pos >= 5 &&
        (!dur || s.pos < dur - 0.5)
      ) {
        s.phase = 'hold';
      } else {
        active(s);
        if (s.wanted) safePlay(s, false);
      }
      sync();
    }, unavailable);
    return s;
  }
  function retire() {
    const s = current;
    if (!s) return;
    clearTimeout(s.lookupTimer);
    flush(s);
    if (s.v) retired = { id: s.id, v: s.v, src: s.v.currentSrc };
    detach(s);
    current = null;
  }
  function sync() {
    if (!hooks || busy || suspended || !S.sessionRestoreOn) return;
    busy = true;
    try {
      const r = route();
      if (current?.id !== r.id) {
        retire();
        if (r.id) open(r);
      }
      const s = current;
      if (!s) return;
      if ((r.explicit && !s.explicit) || S.sessionResumeMode === 'record') {
        s.ask = false;
        if (s.phase !== 'lookup' && locked(s)) active(s);
      }
      s.explicit ||= r.explicit;
      const next = candidate(s);
      if ((next?.v || null) !== s.v || (next?.p || null) !== s.p) {
        detach(s);
        if (next) {
          s.v = next.v;
          s.p = next.p;
        }
      }
      if (!s.v) return;
      if (
        s.phase === 'hold' &&
        s.v.readyState >= 1 &&
        finite(s.v.duration) &&
        s.v.duration > 0 &&
        s.pos >= s.v.duration - 0.25
      )
        s.phase = 'shortened';
      gate(s);
      if (s.phase === 'seeking') seek(s);
      if (['hold', 'shortened', 'seeking', 'seek-error', 'play-blocked'].includes(s.phase)) {
        s.ui ||= createCheckpointPrompt({ choose: (action) => choose(s, action) });
        s.ui.render(s.p, {
          style: S.sessionResumeDesign,
          phase: s.phase,
          pos: ['seeking', 'seek-error', 'play-blocked'].includes(s.phase) ? s.target : s.pos,
          dur: finite(s.v.duration) ? s.v.duration : s.row?.duration || 0,
          title: s.row?.title || metadata(s).title,
        });
      } else if (s.phase === 'active') {
        sample(s, 'tick');
        flush(s, false);
      }
    } finally {
      busy = false;
    }
  }
  function schedule() {
    if (!queued) {
      queued = true;
      queueMicrotask(() => {
        queued = false;
        sync();
      });
    }
  }
  function onMedia(ev) {
    const v = ev.target;
    if (v?.tagName !== 'VIDEO' || !v.closest(mainSelector)) return;
    if (current?.id !== route().id) sync();
    if (current && ['loadstart', 'loadedmetadata'].includes(ev.type)) current.reloaded.add(v);
    // Reconcile the URL/player before accepting an event, including events that
    // arrive before yt-navigate-finish or before the mutation observer runs.
    if (!current || current.id !== route().id || current.v !== v || ev.type === 'loadedmetadata')
      sync();
    const s = current;
    if (!s || s.v !== v || !belongs(s) || candidate(s)?.v !== v) return;
    if (locked(s)) {
      if (ev.type === 'play' || ev.type === 'playing') {
        if (s.phase === 'lookup') s.wanted = true;
        if (!v.paused) v.pause();
      }
      if (['seeked', 'loadedmetadata', 'canplay'].includes(ev.type)) schedule();
      return;
    }
    if (ev.type === 'emptied' || ev.type === 'loadstart') {
      if (s.last) s.verifySource = true;
      s.prev = null;
      return;
    }
    if (ev.type === 'ended' && !v.ended) return;
    sample(s, ev.type);
    flush(s, ['pause', 'ended', 'seeked'].includes(ev.type));
  }
  function edge() {
    const s = current;
    if (!s) return;
    sample(s, 'edge');
    flush(s);
  }
  function configure() {
    if (!S.sessionRestoreOn) {
      stop();
      return;
    }
    if (hooks) {
      sync();
      return;
    }
    hooks = new AbortController();
    const opts = { capture: true, signal: hooks.signal };
    for (const type of [
      'play',
      'playing',
      'pause',
      'timeupdate',
      'seeking',
      'seeked',
      'ended',
      'loadedmetadata',
      'canplay',
      'durationchange',
      'emptied',
      'loadstart',
    ])
      document.addEventListener(type, onMedia, opts);
    document.addEventListener(
      'visibilitychange',
      () => {
        if (document.hidden) edge();
        else sync();
      },
      opts,
    );
    window.addEventListener(
      'pagehide',
      () => {
        edge();
        suspended = true;
        retire();
      },
      opts,
    );
    window.addEventListener(
      'pageshow',
      () => {
        suspended = false;
        sync();
      },
      opts,
    );
    window.addEventListener(
      'storage',
      (ev) => {
        if (ev.key !== 'yourtube.journal.erase' || !ev.newValue) return;
        try {
          const { id } = JSON.parse(ev.newValue);
          if (id === null || CheckpointStore.validId(id)) forget(id);
        } catch (_) {}
      },
      opts,
    );
    document.addEventListener('yt-navigate-start', edge, opts);
    for (const type of ['yt-navigate-finish', 'yt-page-data-updated'])
      document.addEventListener(type, schedule, opts);
    hooks.signal.addEventListener('abort', g.on('nav.changed', sync), { once: true });
    observer = new MutationObserver((records) => {
      if (
        current &&
        (!current.v ||
          !current.v.isConnected ||
          (current.ui && !current.ui.host.isConnected) ||
          records.some((r) =>
            [...r.addedNodes].some(
              (n) =>
                n.nodeType === 1 &&
                (n.matches('video,' + mainSelector) || n.querySelector('video')),
            ),
          ))
      )
        schedule();
    });
    observer.observe(document, { childList: true, subtree: true });
    timer = setInterval(sync, 450);
    sync();
  }
  function stop() {
    if (!hooks) return;
    edge();
    retire();
    hooks.abort();
    hooks = null;
    observer?.disconnect();
    observer = null;
    clearInterval(timer);
    suspended = false;
    retired = null;
  }
  function forget(id) {
    const s = current;
    if (s && (id == null || s.id === id)) {
      s.last = null;
      s.readOnly = true;
      clearTimeout(s.lookupTimer);
      active(s);
    }
  }
  return {
    configure,
    forget,
    flush: () => {
      const s = current;
      if (!s) return Promise.resolve(false);
      sample(s, 'manual');
      return flush(s);
    },
    status: () => ({
      phase: current?.phase || 'off',
      videoId: current?.id || null,
      held: !!current?.v && locked(current),
      readOnly: !!current?.readOnly,
    }),
  };
})();
