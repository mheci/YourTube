// The existing yourtube_v2/history schema stays authoritative. A small, synchronous
// write-ahead record bridges the interval between pagehide and an IndexedDB commit.
// Its key is removed only after that exact revision (or a newer one) is durable.
const CheckpointStore = (() => {
  const prefix = 'yourtube.checkpoint.v1:',
    resetKey = 'checkpoint/erase-generation',
    tickets = 'checkpoint/open/';
  const validId = (id) => typeof id === 'string' && /^[\w-]{11}$/.test(id);
  const finite = (x) => typeof x === 'number' && Number.isFinite(x);
  const compare = (a, b) =>
    !b ? 1 : a.start - b.start || String(a.sid).localeCompare(String(b.sid)) || a.seq - b.seq;
  const nonce = () =>
    crypto.randomUUID
      ? crypto.randomUUID()
      : Date.now().toString(36) + Math.random().toString(36).slice(2);
  function pending(id) {
    try {
      const j = JSON.parse(localStorage.getItem(prefix + id));
      if (
        j &&
        j.id === id &&
        typeof j.sid === 'string' &&
        j.sid.length <= 80 &&
        [j.start, j.seq, j.at, j.pos, j.dur, j.played].every(finite) &&
        j.seq >= 1 &&
        j.pos >= 0 &&
        j.dur > 0 &&
        j.pos <= j.dur &&
        j.played >= 0 &&
        Date.now() - j.at < 7 * 86400000
      )
        return j;
    } catch (_) {}
    return null;
  }
  function remember(s) {
    try {
      const key = prefix + s.id,
        prior = pending(s.id);
      if (compare(s, prior) <= 0) return;
      if (!prior) {
        const keys = Object.keys(localStorage).filter((k) => k.startsWith(prefix));
        if (keys.length >= 24) {
          keys.sort(
            (a, b) =>
              (pending(a.slice(prefix.length))?.at || 0) -
              (pending(b.slice(prefix.length))?.at || 0),
          );
          for (const k of keys.slice(0, keys.length - 23)) localStorage.removeItem(k);
        }
      }
      // No title, URL, channel name, tags, notes or thumbnail in the journal.
      const { id, sid, start, seq, at, pos, dur, played, done, epoch, life } = s;
      localStorage.setItem(
        key,
        JSON.stringify({ id, sid, start, seq, at, pos, dur, played, done, epoch, life }),
      );
    } catch (_) {
      /* Private storage / quota: IDB is still attempted independently. */
    }
  }
  function acknowledge(s) {
    try {
      const j = pending(s.id);
      if (j && compare(j, s) === 0) localStorage.removeItem(prefix + s.id);
    } catch (_) {}
  }
  // Both reads and a potential write happen in ONE transaction, not across awaits.
  async function rowTx(id, mode, edit) {
    if (!validId(id)) throw new Error('Invalid video ID');
    const db = await b();
    if (!db) throw new Error('History storage unavailable');
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['history', 'kv'], mode),
        store = tx.objectStore('history');
      const kv = tx.objectStore('kv'),
        row = store.get(id),
        fence = kv.get(resetKey),
        ticket = kv.get(tickets + id);
      let result;
      ticket.onsuccess = () => {
        try {
          result = edit(
            row.result || null,
            fence.result?.v || '',
            store,
            kv,
            row.result?._checkpointLife || ticket.result?.v || '',
          );
        } catch (error) {
          tx.abort();
          reject(error);
        }
      };
      tx.oncomplete = () => resolve(result);
      tx.onabort = tx.onerror = () => reject(tx.error || new Error('History transaction failed'));
    });
  }
  function blank(id, now) {
    return {
      videoId: id,
      firstWatched: now,
      lastWatched: now,
      watchCount: 0,
      totalWatchTime: 0,
      sessions: [],
      title: '',
      channel: '',
      channelId: '',
      thumbnail: '',
      lastPosition: 0,
      duration: 0,
      remaining: 0,
      progress: 0,
      completed: false,
      pinned: 0,
      tags: [],
      notes: '',
    };
  }
  async function persist(s) {
    const changed = await rowTx(s.id, 'readwrite', (old, epoch, store, kv, life) => {
      // Both fences are checked inside the same transaction as the put. Erasing
      // one film must not silence older tabs recording a DIFFERENT film.
      if (epoch !== s.epoch || !life || life !== s.life) return false;
      if (old?._checkpoint && compare(s, old._checkpoint) <= 0) return false;
      if (!old?._checkpoint && old && (old.lastWatched || 0) > s.at) return false;
      const row = old || blank(s.id, s.start),
        visits = Array.isArray(row.sessions) ? row.sessions.slice(-50) : [];
      const previous = visits.find((v) => v?.sid === s.sid);
      row.totalWatchTime =
        (Number(row.totalWatchTime) || 0) + Math.max(0, s.played - (previous?.played || 0));
      if (!previous) {
        visits.push({ sid: s.sid, start: s.start });
        row.watchCount = (Number(row.watchCount) || 0) + 1;
      }
      Object.assign(previous || visits[visits.length - 1], { end: s.at, played: s.played });
      row.sessions = visits.slice(-50);
      row.lastWatched = s.at;
      row.lastPosition = s.done ? 0 : s.pos;
      row.duration = s.dur;
      row.progress = s.done ? 100 : Math.min(99, Math.round((100 * s.pos) / s.dur));
      row.remaining = s.done ? 0 : Math.max(0, s.dur - s.pos);
      row.completed = !!s.done;
      for (const k of ['title', 'channel', 'channelId'])
        if (s.meta?.[k]) row[k] = String(s.meta[k]).slice(0, 300);
      if (!row.thumbnail) row.thumbnail = ie.thumb(s.id, 'mqdefault');
      row._checkpointLife = life;
      row._checkpoint = { start: s.start, sid: s.sid, seq: s.seq };
      store.put(row);
      kv.delete(tickets + s.id);
      return true;
    });
    acknowledge(s);
    if (changed) g.emit('history.updated', { videoId: s.id });
    return changed;
  }
  async function load(id) {
    const j = pending(id);
    if (j) await persist(j);
    return rowTx(id, 'readwrite', (row, epoch, store, kv, life) => {
      // Reserve an incarnation, NOT a watch-history entry. The temporary ticket
      // has no title or position; first durable playback moves it into the row.
      if (!life) {
        life = nonce();
        kv.put({ k: tickets + id, v: life, at: Date.now() });
      }
      return { row, epoch, life };
    });
  }
  function commit(s) {
    remember(s);
    return persist(s);
  }
  function edit(id, fn) {
    return rowTx(id, 'readwrite', (r, epoch, store) => {
      const updated = fn(r);
      if (updated) store.put(updated);
      return updated;
    });
  }
  async function erase(id) {
    if (id != null && !validId(id)) return;
    WatchSessions.forget(id); // Stop this visit before a final flush can resurrect it.
    try {
      for (const k of Object.keys(localStorage))
        if (id == null ? k.startsWith(prefix) : k === prefix + id) localStorage.removeItem(k);
    } catch (_) {}
    const db = await b();
    if (!db) throw new Error('History storage unavailable');
    await new Promise((resolve, reject) => {
      const tx = db.transaction(['history', 'kv'], 'readwrite'),
        store = tx.objectStore('history');
      const kv = tx.objectStore('kv');
      if (id == null) {
        kv.put({ k: resetKey, v: nonce() });
        kv.delete(IDBKeyRange.bound(tickets, tickets + '\uffff'));
        store.clear();
      } else {
        kv.delete(tickets + id);
        store.delete(id);
      }
      tx.oncomplete = resolve;
      tx.onerror = tx.onabort = () => reject(tx.error || new Error('Erase failed'));
    });
    // Wake other open prompts without leaving a persistent log of erased IDs.
    try {
      localStorage.setItem('yourtube.journal.erase', JSON.stringify({ id, nonce: nonce() }));
      localStorage.removeItem('yourtube.journal.erase');
    } catch (_) {}
    g.emit('history.updated', { videoId: id, removed: true });
  }
  async function pruneTickets() {
    const db = await b();
    if (!db) return;
    const store = db.transaction('kv', 'readwrite').objectStore('kv');
    const req = store.openCursor(IDBKeyRange.bound(tickets, tickets + '\uffff'));
    req.onsuccess = () => {
      const cur = req.result;
      if (!cur) return;
      if (Date.now() - (cur.value.at || 0) > 7 * 86400000) cur.delete();
      cur.continue();
    };
  }
  return { load, commit, edit, erase, blank, nonce, validId, pruneTickets };
})();
