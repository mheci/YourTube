// The journal works with existing history rows. Merely opening the library never
// requests third-party artwork or enriches records over the network.
function mountWatchLibrary(parent) {
  const host = document.createElement('div');
  host.className = 'ytb-watch-journal';
  parent.append(host);
  const root = host.attachShadow({ mode: 'open' }),
    css = document.createElement('style');
  css.textContent = `:host{${JOURNAL_PROPERTIES}display:block;margin:12px 0;color:var(--j-ink);font:13px/1.4 var(--j-ui);color-scheme:light}*{box-sizing:border-box}[hidden]{display:none!important}.book{background:var(--j-paper);border:1px solid var(--j-rule);padding:15px;border-radius:9px}h3{font:normal 27px/1.1 var(--j-serif);letter-spacing:-.04em;margin:4px 0 11px}.cap,.meta{font:600 10px/1.4 var(--j-mono);color:var(--j-muted)}.cap{text-transform:uppercase;letter-spacing:.12em}.toolbar,.actions,.meta,.row,.tools{display:flex;align-items:center;gap:6px;flex-wrap:wrap}button,input,select,a{font:inherit;color:inherit}.toolbar input,.toolbar select,button,a{border:1px solid var(--j-field-rule);background:var(--j-field);border-radius:4px;padding:5px 8px}.toolbar input{min-width:80px;flex:1}.toolbar select{max-width:100%}.list{max-height:330px;overflow:auto;margin:8px 0}.row{padding:10px 0;border-bottom:1px solid var(--j-hair)}.details{flex:1;min-width:130px}.name{font-weight:650;color:var(--j-heading)}.meta{font-weight:450;margin:3px 0}.rail{height:3px;max-width:180px;background:var(--j-rail)}.rail span{display:block;background:var(--j-fill);height:100%}.actions{gap:4px}button,a{cursor:pointer;font-size:11px;text-decoration:none}.go{background:var(--j-green);color:white;border-color:var(--j-green)}.actions button{border:0;background:transparent;text-decoration:underline;text-underline-offset:2px}.tools{border-top:1px solid var(--j-rule);padding-top:9px}.msg{color:#3f5e50;min-height:1.4em;margin:6px 0 0}.danger{color:var(--j-danger)}button:focus-visible,a:focus-visible,select:focus-visible,input:focus-visible{outline:2px solid var(--j-focus);outline-offset:2px}`;
  root.append(css);
  const add = (p, t, c, txt) => {
    const n = document.createElement(t);
    n.className = c;
    n.textContent = txt || '';
    p.append(n);
    return n;
  };
  const book = add(root, 'section', 'book'),
    cap = add(book, 'span', 'cap', 'Local history  /  This browser');
  add(book, 'h3', '', 'Watch journal');
  const bar = add(book, 'div', 'toolbar'),
    search = add(bar, 'input', '');
  search.type = 'search';
  search.placeholder = 'Search title or channel';
  search.setAttribute('aria-label', search.placeholder);
  const filter = add(bar, 'select', '');
  filter.setAttribute('aria-label', 'Filter history');
  for (const [value, label] of [
    ['all', 'All videos'],
    ['progress', 'In progress'],
    ['pinned', 'Pinned'],
    ['done', 'Finished'],
  ]) {
    const o = add(filter, 'option', '', label);
    o.value = value;
  }
  const list = add(book, 'div', 'list'),
    tools = add(book, 'div', 'tools'),
    msg = add(book, 'p', 'msg');
  msg.setAttribute('role', 'status');
  const button = (p, label, fn, cls = '') => {
    const n = add(p, 'button', cls, label);
    n.type = 'button';
    n.onclick = () =>
      Promise.resolve()
        .then(fn)
        .catch(() => {
          msg.textContent = 'Could not update local history. Nothing was confirmed.';
        });
    return n;
  };
  let rows = [],
    limit = 20,
    turn = 0,
    pendingDelete = null;
  const link = (p, label, id, time) => {
    const a = add(p, 'a', 'go', label);
    const u = new URL('/watch', location.origin);
    u.searchParams.set('v', id);
    u.searchParams.set('t', Math.floor(time) + 's');
    a.href = u.href;
  };
  function render() {
    const q = search.value.trim().toLowerCase(),
      match = rows.filter(
        (r) =>
          CheckpointStore.validId(r.videoId) &&
          (!q || [r.title, r.channel, r.videoId].join(' ').toLowerCase().includes(q)) &&
          (filter.value === 'all' ||
            (filter.value === 'pinned' && r.pinned) ||
            (filter.value === 'done' && r.completed) ||
            (filter.value === 'progress' && !r.completed && r.lastPosition > 0)),
      );
    cap.textContent =
      'Local history  /  ' + match.length + ' ' + (match.length === 1 ? 'video' : 'videos');
    list.replaceChildren();
    if (!match.length)
      add(
        list,
        'p',
        'meta',
        rows.length ? 'No matches. Try another search.' : 'Your watched videos will appear here.',
      );
    for (const r of match.slice(0, limit)) {
      const item = add(list, 'div', 'row'),
        d = add(item, 'div', 'details');
      add(d, 'div', 'name', (r.pinned ? '★  ' : '') + (r.title || r.videoId));
      add(
        d,
        'span',
        'meta',
        [
          r.channel,
          r.completed ? 'Finished' : ce(r.lastPosition || 0) + ' of ' + ce(r.duration || 0),
        ]
          .filter(Boolean)
          .join(' · '),
      );
      const progress = add(add(d, 'div', 'rail'), 'span', '');
      progress.style.width = Math.max(0, Math.min(100, Number(r.progress) || 0)) + '%';
      const acts = add(item, 'div', 'actions');
      link(
        acts,
        r.completed ? 'Rewatch' : r.lastPosition > 0 ? 'Resume ' + ce(r.lastPosition) : 'Play',
        r.videoId,
        r.completed ? 0 : r.lastPosition || 0,
      );
      button(acts, r.pinned ? 'Unpin' : 'Pin', () =>
        r.pinned ? $e.unpin(r.videoId) : $e.pin(r.videoId),
      );
      button(acts, 'Remove', () => confirmDelete(r.videoId, r.title || r.videoId), 'danger');
    }
    if (match.length > limit)
      button(list, 'Show 20 more', () => {
        limit += 20;
        render();
      });
  }
  async function refresh() {
    const n = ++turn;
    const data = await Ie();
    if (n !== turn) return;
    rows = data
      .slice()
      .sort((a, b) => !!b.pinned - !!a.pinned || (b.lastWatched || 0) - (a.lastWatched || 0));
    render();
  }
  function confirmDelete(id, label) {
    if (pendingDelete) pendingDelete.remove();
    const box = add(book, 'div', 'actions');
    pendingDelete = box;
    add(box, 'span', '', 'Remove ' + label + '?');
    const cancel = button(box, 'Cancel', () => {
      box.remove();
      pendingDelete = null;
    });
    button(
      box,
      'Confirm removal',
      async () => {
        if (id) await Pe(id);
        else {
          await Re();
          await C('thumbCache');
        }
        box.remove();
        pendingDelete = null;
        await refresh();
        msg.textContent = 'Removed from this browser.';
      },
      'danger',
    );
    cancel.focus();
  }
  search.oninput = filter.onchange = () => {
    limit = 20;
    render();
  };
  button(tools, 'Export JSON', async () => {
    const history = (await Ie()).map(({ _checkpoint, _checkpointLife, ...portable }) => portable),
      url = URL.createObjectURL(
        new Blob([JSON.stringify({ version: n, history }, null, 2)], { type: 'application/json' }),
      );
    const a = document.createElement('a');
    a.href = url;
    a.download = 'yourtube-watch-journal.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 6000);
    msg.textContent = 'Exported ' + history.length + ' entries.';
  });
  const input = add(tools, 'input', '');
  input.type = 'file';
  input.accept = '.json,application/json';
  input.hidden = true;
  button(tools, 'Import JSON', () => input.click());
  input.onchange = async () => {
    try {
      const file = input.files?.[0];
      if (!file) return;
      if (file.size > 8 * 1024 * 1024) throw Error();
      const obj = JSON.parse(await file.text()),
        entries = Array.isArray(obj) ? obj : obj.history;
      if (!Array.isArray(entries) || entries.length > 5000) throw Error();
      let count = 0;
      for (const item of entries) {
        if (!CheckpointStore.validId(item?.videoId)) continue;
        // Accept portable fields, never restore another profile's write fences.
        const num = (v, max = Number.MAX_SAFE_INTEGER) =>
          Math.max(0, Math.min(max, Number(v) || 0));
        const row = CheckpointStore.blank(item.videoId, 0);
        for (const [k, limit] of [
          ['title', 300],
          ['channel', 200],
          ['channelId', 128],
          ['notes', 65536],
        ])
          if (typeof item[k] === 'string') row[k] = item[k].slice(0, limit);
        row.thumbnail = ie.thumb(item.videoId, 'mqdefault');
        for (const k of ['duration', 'lastPosition', 'totalWatchTime']) row[k] = num(item[k]);
        row.watchCount = Math.floor(num(item.watchCount));
        row.firstWatched = num(item.firstWatched, Date.now());
        row.lastWatched = num(item.lastWatched, Date.now());
        row.completed = item.completed === true;
        row.pinned = item.pinned === true || item.pinned === 1 ? 1 : 0;
        row.progress = row.completed ? 100 : num(item.progress, 99);
        if (
          !row.lastPosition &&
          !row.completed &&
          !item._checkpoint &&
          row.duration &&
          row.progress > 1
        )
          row.lastPosition = (row.duration * row.progress) / 100;
        row.lastPosition = row.completed
          ? 0
          : row.duration
            ? Math.min(row.duration, row.lastPosition)
            : row.lastPosition;
        row.remaining = row.completed ? 0 : Math.max(0, row.duration - row.lastPosition);
        row.tags = Array.isArray(item.tags)
          ? item.tags
              .filter((t) => typeof t === 'string')
              .slice(0, 100)
              .map((t) => t.slice(0, 160))
          : [];
        if (Array.isArray(item.sessions))
          row.sessions = item.sessions
            .slice(-50)
            .filter((v) => v && typeof v === 'object')
            .map((v) => {
              const session = { start: num(v.start) };
              for (const k of ['end', 'played']) if (k in v) session[k] = num(v[k]);
              if (typeof v.kind === 'string') session.kind = v.kind.slice(0, 60);
              return session;
            });
        const merged = await CheckpointStore.edit(row.videoId, (prev) => {
          if (prev && (prev.lastWatched || 0) >= row.lastWatched) return null;
          // Delayed flushes from a tab opened before this import must not win.
          return {
            ...prev,
            ...row,
            _checkpointLife: CheckpointStore.nonce(),
            _checkpoint: { start: Date.now(), sid: CheckpointStore.nonce(), seq: 0 },
          };
        });
        if (merged) count++;
      }
      await refresh();
      msg.textContent = 'Imported ' + count + ' entries. Newer local saves were kept.';
    } catch (_) {
      msg.textContent = 'Import stopped. Use a history JSON file under 8 MB.';
    } finally {
      input.value = '';
    }
  };
  button(tools, 'Clear history', () => confirmDelete(null, 'all local watch history'), 'danger');
  So('history.updated', refresh);
  refresh();
}
