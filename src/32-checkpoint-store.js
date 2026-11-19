// The existing yourtube_v2/history schema stays authoritative. A small, synchronous
// write-ahead record bridges the interval between pagehide and an IndexedDB commit.
// Its key is removed only after that exact revision (or a newer one) is durable.
const CheckpointStore = (() => {
  const prefix = 'yourtube.checkpoint.v1:',
    resetKey = 'checkpoint/erase-generation',
    tickets = 'checkpoint/open/',
    trashPrefix = 'yourtube/trash/history/',
    trashWindow = 7 * 86400000;
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
        visits = Array.isArray(row.sessions) ? row.sessions.slice() : [];
      // Older restored history used a row-level exemption. Convert it to
      // per-session exemptions before adding an unrelated future visit.
      if (row.retentionExempt && !visits.some(v => v?.sid === s.sid)) {
        for (let i = 0; i < visits.length; i++) if (visits[i] && typeof visits[i] === 'object') visits[i] = {...visits[i], retentionExempt:true};
        row.retentionExempt = false;
      }
      const previous = visits.find((v) => v?.sid === s.sid);
      row.totalWatchTime =
        (Number(row.totalWatchTime) || 0) + Math.max(0, s.played - (previous?.played || 0));
      if (!previous) {
        visits.push({ sid: s.sid, start: s.start });
        row.watchCount = (Number(row.watchCount) || 0) + 1;
      }
      Object.assign(previous || visits[visits.length - 1], { end: s.at, played: s.played });
      row.sessions = visits;
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
      const deletedAt = Date.now();
      const saveToTrash = (row) => {
        if (!row) return;
        kv.put({ k: trashPrefix + nonce(), v: {
          kind: 'history', deletedAt, expiresAt: deletedAt + trashWindow, row,
        }});
      };
      if (id == null) {
        kv.put({ k: resetKey, v: nonce() });
        kv.delete(IDBKeyRange.bound(tickets, tickets + '\uffff'));
        // Copy and delete atomically: a failed transaction loses neither.
        const cursor = store.openCursor();
        cursor.onsuccess = () => {
          const c = cursor.result;
          if (!c) return;
          saveToTrash(c.value);
          c.delete();
          c.continue();
        };
      } else {
        kv.delete(tickets + id);
        const request = store.get(id);
        request.onsuccess = () => { saveToTrash(request.result); store.delete(id); };
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
  async function trash() {
    const db = await b();
    if (!db) throw new Error('History storage unavailable');
    return new Promise((resolve, reject) => {
      const tx = db.transaction('kv', 'readwrite'), store = tx.objectStore('kv');
      const request = store.openCursor(IDBKeyRange.bound(trashPrefix, trashPrefix + '\uffff'));
      const rows = [], now = Date.now();
      request.onsuccess = () => {
        const cursor = request.result;
        if (!cursor) return;
        const value = cursor.value?.v;
        if (value && Number.isFinite(value.expiresAt) && value.expiresAt <= now) cursor.delete();
        else if (value?.kind === 'history' && validId(value.row?.videoId))
          rows.push({ key: cursor.key, ...value });
        cursor.continue();
      };
      tx.oncomplete = () => resolve(rows.sort((a, b) => b.deletedAt - a.deletedAt));
      tx.onerror = tx.onabort = () => reject(tx.error || new Error('Trash lookup failed'));
    });
  }
  // Import a portable history row and route expired sessions directly to
  // trash in the same transaction, without overwriting a newer local row.
  async function importActive(row) {
    if (!validId(row?.videoId)) throw new Error('Invalid history item');
    await MigrationBackup.ensure();
    const db = await b();
    if (!db) throw new Error('History storage unavailable');
    const now = Date.now(), sessions = Array.isArray(row.sessions) ? row.sessions : [];
    const decision = row.retentionExempt === true ? {trash:[],discard:[],undated:[]} : RetentionPolicy.classify(sessions, now, S.sessionGapMinutes);
    const expired = [...decision.trash,...decision.discard], removedSessions = expired.flatMap(group => group.sessions), removed = new Set(removedSessions);
    const retained = sessions.filter(session => !removed.has(session));
    const played = list => list.reduce((n,s) => {const p=Number(s?.played);return n+(Number.isFinite(p)&&p>=0?p:0);},0);
    const remainingTime = Math.max(0,(Number(row.totalWatchTime)||0)-played(removedSessions));
    const remainingCount = Math.max(0,(Number(row.watchCount)||0)-removedSessions.length);
    const legacy = remainingTime > 0.001 || remainingCount > retained.length || decision.undated.length > 0;
    const recentResume = Number(row.lastWatched)>0 && RetentionPolicy.plusMonths(Number(row.lastWatched))>now;
    const hasActive = !sessions.length || retained.length>0 || legacy || recentResume;
    const latestEnd = sessions.reduce((latest,s) => Math.max(latest,Number(s?.end)||Number(s?.start)||0),0);
    const result = await new Promise((resolve,reject) => {
      const tx=db.transaction(['history','kv'],'readwrite'), history=tx.objectStore('history'),kv=tx.objectStore('kv');
      const existing=history.get(row.videoId);
      // Most imports have no expired recoverable groups; avoid scanning all trash for every row.
      const cursor=decision.trash.length ? kv.openCursor(IDBKeyRange.bound(trashPrefix,trashPrefix+'\uffff')) : null;
      const known=new Set();
      let imported=0,moved=0,duplicates=0;
      const writeImport = () => {
        try {
          for(const group of decision.trash){
            if(known.has(group.expiresAt)){duplicates++;continue;}
            const snapshot={...row,sessions:group.sessions,watchCount:group.sessions.length,totalWatchTime:played(group.sessions),firstWatched:group.start,lastWatched:group.end};
            if(group.end!==latestEnd) Object.assign(snapshot,{lastPosition:0,progress:0,remaining:0,completed:false});
            delete snapshot._checkpoint;delete snapshot._checkpointLife;
            kv.put({k:trashPrefix+nonce(),v:{kind:'history',scope:'sessions',deletedAt:group.expiresAt,expiresAt:group.trashExpiresAt,row:snapshot}});
            known.add(group.expiresAt);moved++;
          }
          const prior=existing.result;
          if(hasActive && (!prior || (Number(prior.lastWatched)||0)<(Number(row.lastWatched)||0))){
            history.put({...prior,...row,sessions:retained,watchCount:remainingCount,totalWatchTime:remainingTime,
              _checkpointLife:nonce(),_checkpoint:{start:now,sid:nonce(),seq:0}});
            imported=1;
          }
        } catch(error){try{tx.abort();}catch(_){}reject(error);}
      };
      if (cursor) cursor.onsuccess = () => {
        const c=cursor.result;
        if(c){const v=c.value?.v;if(v?.scope==='sessions'&&v.row?.videoId===row.videoId&&Number.isFinite(v.deletedAt)&&Number(v.expiresAt)>now) known.add(v.deletedAt);c.continue();return;}
        writeImport();
      };
      else existing.onsuccess = writeImport;
      tx.oncomplete=()=>resolve({imported,moved,discarded:decision.discard.length,duplicates});
      tx.onerror=tx.onabort=()=>reject(tx.error||new Error('History import transaction failed'));
    });
    if(result.imported||result.moved) g.emit('history.updated',{imported:true});
    return result;
  }
  // Expire dated watch-session groups atomically with their trash records.
  // Legacy undated/unallocated data is deliberately kept rather than guessed.
  async function expireSessions(now = Date.now(), gapMinutes = S.sessionGapMinutes) {
    if (!Number.isFinite(now)) throw new Error('Invalid retention time');
    // Never delete anything unless a durable backup exists.
    await MigrationBackup.ensure();
    const db = await b();
    if (!db) throw new Error('History storage unavailable');
    const currentId = WatchSessions.status().videoId;
    const counts = await new Promise((resolve, reject) => {
      const tx = db.transaction(['history', 'kv'], 'readwrite');
      const history = tx.objectStore('history'), kv = tx.objectStore('kv');
      const cursor = history.openCursor();
      let moved = 0, discarded = 0, changed = 0;
      cursor.onsuccess = () => {
        try {
          const c = cursor.result;
          if (!c) return;
          const row = c.value;
          if (!row || !validId(row.videoId) || row.videoId === currentId || row.retentionExempt === true || !Array.isArray(row.sessions)) { c.continue(); return; }
          const decision = RetentionPolicy.classify(row.sessions, now, gapMinutes);
          const expired = [...decision.trash, ...decision.discard];
          if (!expired.length) { c.continue(); return; }
          const expiredSessions = expired.flatMap(group => group.sessions);
          const removed = new Set(expiredSessions);
          const retained = row.sessions.filter(session => !removed.has(session));
          const played = sessions => sessions.reduce((sum, session) => {
            const value = Number(session?.played);
            return sum + (Number.isFinite(value) && value >= 0 ? value : 0);
          }, 0);
          const oldTime = Math.max(0, Number(row.totalWatchTime) || 0), removedTime = played(expiredSessions);
          const remainingTime = Math.max(0, oldTime - removedTime);
          const oldCount = Math.max(0, Number(row.watchCount) || 0);
          const remainingCount = Math.max(0, oldCount - expiredSessions.length);
          const latestEnd = row.sessions.reduce((latest,v) => Math.max(latest, Number(v?.end) || Number(v?.start) || 0), 0);
          for (const group of decision.trash) {
            const newest = group.end === latestEnd;
            const snapshot = {...row, sessions:group.sessions, watchCount:group.sessions.length,
              totalWatchTime:played(group.sessions), firstWatched:group.start, lastWatched:group.end};
            // A past group cannot restore another, more recent group's resume.
            if (!newest) Object.assign(snapshot, {lastPosition:0, progress:0, remaining:0, completed:false});
            delete snapshot._checkpoint; delete snapshot._checkpointLife;
            kv.put({k:trashPrefix + nonce(), v:{kind:'history', scope:'sessions', deletedAt:group.expiresAt,
              expiresAt:group.trashExpiresAt, row:snapshot}});
            moved++;
          }
          discarded += decision.discard.length;
          const residual = remainingTime > 0.001 || remainingCount > retained.length || decision.undated.length > 0;
          // Preserve unknown legacy totals and any more-recent undated resume.
          const rowDate = Number(row.lastWatched) || 0;
          const resumeStillCurrent = rowDate > 0 && RetentionPolicy.plusMonths(rowDate) > now;
          if (!retained.length && !residual && !resumeStillCurrent) {
            c.delete(); kv.delete(tickets + row.videoId);
          } else {
            c.update({...row, sessions:retained, totalWatchTime:remainingTime, watchCount:remainingCount});
          }
          changed++;
          c.continue();
        } catch (error) { try { tx.abort(); } catch (_) {} reject(error); }
      };
      tx.oncomplete = () => resolve({moved, discarded, changed});
      tx.onerror = tx.onabort = () => reject(tx.error || new Error('History retention transaction failed'));
    });
    if (counts.changed) g.emit('history.updated', {retention:true});
    return counts;
  }
  async function restoreTrash(key) {
    if (typeof key !== 'string' || !key.startsWith(trashPrefix)) throw new Error('Invalid trash key');
    const db = await b();
    if (!db) throw new Error('History storage unavailable');
    const result = await new Promise((resolve, reject) => {
      const tx = db.transaction(['history', 'kv'], 'readwrite');
      const kv = tx.objectStore('kv'), history = tx.objectStore('history');
      const request = kv.get(key);
      let outcome = 'missing';
      request.onsuccess = () => {
        const value = request.result?.v;
        if (!value || value.kind !== 'history' || !validId(value.row?.videoId)) return;
        if (!Number.isFinite(value.expiresAt) || value.expiresAt <= Date.now()) {
          outcome = 'expired'; kv.delete(key); return;
        }
        const existing = history.get(value.row.videoId);
        existing.onsuccess = () => {
          const prior = existing.result;
          if (value.scope === 'sessions') {
            const restored = Array.isArray(value.row.sessions) ? value.row.sessions : [];
            if (!restored.length || restored.some(session => !session || typeof session !== 'object' || !Number.isFinite(session.start) || session.start <= 0)) { outcome = 'invalid'; return; }
            const current = Array.isArray(prior?.sessions) ? prior.sessions : [];
            const signature = session => session?.sid ? 'sid:' + session.sid : JSON.stringify([session?.start, session?.end, session?.played, session?.kind]);
            const ids = new Set(current.map(signature));
            if (restored.some(session => ids.has(signature(session)))) { outcome = 'conflict'; return; }
            const sessions = restored.map(session => ({...session, retentionExempt:true}));
            const target = prior ? {...prior,
              sessions:[...current,...sessions],
              totalWatchTime:(Number(prior.totalWatchTime)||0)+(Number(value.row.totalWatchTime)||0),
              watchCount:(Number(prior.watchCount)||0)+(Number(value.row.watchCount)||0),
              firstWatched:Math.min(Number(prior.firstWatched)||Number(value.row.firstWatched)||Date.now(),Number(value.row.firstWatched)||Number(prior.firstWatched)||Date.now()),
            } : {...value.row, sessions, retentionExempt:true,
              _checkpointLife:nonce(), _checkpoint:{start:Date.now(),sid:nonce(),seq:0}};
            history.put(target);
          } else {
            // Whole-record manual restore never overwrites a newer recording.
            if (prior) { outcome = 'conflict'; return; }
            const sessions = Array.isArray(value.row.sessions) ? value.row.sessions.map(s => s && typeof s === 'object' ? {...s, retentionExempt:true} : s) : [];
            history.put({ ...value.row, sessions, retentionExempt: true,
              _checkpointLife: nonce(), _checkpoint: { start: Date.now(), sid: nonce(), seq: 0 } });
          }
          kv.delete(key);
          outcome = 'restored';
        };
      };
      tx.oncomplete = () => resolve(outcome);
      tx.onerror = tx.onabort = () => reject(tx.error || new Error('Trash restore failed'));
    });
    if (result === 'restored') g.emit('history.updated', { restored: true });
    return result;
  }
  async function importTrash(entries) {
    if (!Array.isArray(entries) || entries.length > 5000) throw new Error('Invalid trash backup');
    const db = await b();
    if (!db) throw new Error('History storage unavailable');
    return new Promise((resolve, reject) => {
      const tx = db.transaction('kv', 'readwrite'), store = tx.objectStore('kv');
      const now = Date.now(), known = new Set();
      let imported = 0, discarded = 0;
      const cursor = store.openCursor(IDBKeyRange.bound(trashPrefix, trashPrefix + '\uffff'));
      cursor.onsuccess = () => {
        const c = cursor.result;
        if (c) {
          const v = c.value?.v;
          if (v?.row?.videoId && Number.isFinite(v.deletedAt)) known.add(v.row.videoId + ':' + v.deletedAt);
          c.continue();
          return;
        }
        for (const item of entries) {
          if (!item || item.kind !== 'history' || !validId(item.row?.videoId) ||
              (item.scope === 'sessions' && (!Array.isArray(item.row.sessions) || !item.row.sessions.length || item.row.sessions.some(s => !s || typeof s !== 'object' || !Number.isFinite(s.start) || s.start <= 0))) ||
              !Number.isFinite(item.deletedAt) || item.deletedAt <= 0 || item.deletedAt > now ||
              !Number.isFinite(item.expiresAt) || item.expiresAt <= now ||
              item.expiresAt > item.deletedAt + trashWindow) { discarded++; continue; }
          const fingerprint = item.row.videoId + ':' + item.deletedAt;
          if (known.has(fingerprint)) { discarded++; continue; }
          known.add(fingerprint);
          store.put({ k: trashPrefix + nonce(), v: {
            kind: 'history', ...(item.scope === 'sessions' ? {scope:'sessions'} : {}), deletedAt: item.deletedAt, expiresAt: item.expiresAt, row: item.row,
          }});
          imported++;
        }
      };
      tx.oncomplete = () => resolve({ imported, discarded });
      tx.onerror = tx.onabort = () => reject(tx.error || new Error('Trash import failed'));
    });
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
  return { load, commit, edit, erase, trash, restoreTrash, importTrash, importActive, expireSessions, blank, nonce, validId, pruneTickets };
})();
