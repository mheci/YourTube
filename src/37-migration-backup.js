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
      const existing = kv.get(key), rows = history.getAll(), values = kv.getAll();
      let made = false;
      values.onsuccess = () => {
        if (existing.result) return;
        const records = values.result.filter(row => row && typeof row.k === 'string' &&
          (selected.has(row.k) || row.k.startsWith('note:video:')));
        kv.put({k:key, v:{format:'yourtube-migration-backup-v1', createdAt:Date.now(),
          settings:{...S}, history:rows.result || [], records}});
        made = true;
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
