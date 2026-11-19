// Preserve a one-time, atomic local snapshot before any data-lifecycle
// migration. A failed backup never marks the migration safe to perform.
const MigrationBackup = (() => {
  const key = 'yourtube/migration-backup/v1';
  const selected = new Set(['__yourtube_notes__','__yourtube_bookmarks__','__yourtube_collections__','__yourtube_pl_resume__']);
  async function ensure() {
    const db = await b();
    if (!db) throw new Error('Local storage unavailable');
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['history','kv'], 'readwrite');
      const kv = tx.objectStore('kv'), history = tx.objectStore('history');
      const existing = kv.get(key);
      let made = false;
      existing.onsuccess = () => {
        if (existing.result) {
          const saved = existing.result.v;
          if (!saved || saved.format !== 'yourtube-migration-backup-v1' || !Array.isArray(saved.history) || !Array.isArray(saved.records) || !saved.settings || typeof saved.settings !== 'object') {
            try { tx.abort(); } catch (_) {}
            reject(new Error('Existing migration backup is invalid; no retention changes were made'));
          }
          return;
        }
        const rows = history.getAll(), values = kv.getAll();
        values.onsuccess = () => {
          try {
            const records = values.result.filter(row => row && typeof row.k === 'string' &&
              (selected.has(row.k) || row.k.startsWith('note:video:')));
            // z() only hydrates synchronous mirrors. IndexedDB may contain a newer
            // configuration until the later asynchronous boot merge has finished.
            // Select from the same version/timestamp sources as that merge, while
            // retaining raw copies for recovery instead of silently backing up defaults.
            const stored = values.result.find(row => row?.k === I);
            const candidates = [];
            if (stored?.v && typeof stored.v === 'object')
              candidates.push({src:'idb', data:stored.v, ver:stored.ver || 0, ts:stored.updatedAt || 0});
            const gm = q(), local = V();
            if (gm) candidates.push({src:'gm', data:gm, ver:gm.__ver || 0, ts:gm.__ts || 0});
            if (local) candidates.push({src:'local', data:local, ver:local.__ver || 0, ts:local.__ts || 0});
            const selectedConfig = F(candidates.slice());
            const settings = selectedConfig ? {...selectedConfig.data} : {...S};
            delete settings.__ts; delete settings.__ver;
            kv.put({k:key, v:{format:'yourtube-migration-backup-v1', createdAt:Date.now(),
              settings, settingsSources:candidates, history:rows.result || [], records}});
            made = true;
          } catch (error) {
            // A synchronous clone/quota failure in this event callback is not
            // caught by the outer promise executor. Fail the migration closed.
            try { tx.abort(); } catch (_) {}
            reject(error);
          }
        };
      };
      tx.oncomplete = () => resolve(made);
      tx.onerror = tx.onabort = () => reject(tx.error || new Error('Migration backup failed'));
    });
  }
  async function read() {
    const db = await b();
    if (!db) throw new Error('Local storage unavailable');
    return new Promise((resolve,reject) => {
      const tx = db.transaction('kv','readonly'), req = tx.objectStore('kv').get(key);
      tx.oncomplete = () => resolve(req.result?.v || null);
      tx.onerror = tx.onabort = () => reject(tx.error || new Error('Migration backup read failed'));
    });
  }
  return {ensure, read};
})();
