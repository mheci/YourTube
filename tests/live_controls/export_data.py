"""Exercise the real local-data export button and inspect downloaded JSON bytes."""
import json
import tempfile
from pathlib import Path

def run(p):
    row={"id":"export-data","key":"Notes & bookmarks","description":"Real download contains saved video notes, timestamp notes, bookmarks and collections"}
    try:
        p.evaluate('''async()=>{let db=await new Promise((ok,no)=>{const r=indexedDB.open('yourtube_v2');r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)});await new Promise((ok,no)=>{const tx=db.transaction('kv','readwrite'),s=tx.objectStore('kv');for(const r of [
          {k:'note:video:LabVideo001',v:'video note'},
          {k:'__yourtube_notes__',v:{LabVideo001:[{t:12,text:'timestamp note',at:123}]}},
          {k:'__yourtube_bookmarks__',v:{LabVideo001:[{t:20,at:124}]}},
          {k:'__yourtube_collections__',v:[{id:'col-1',name:'Collection',videos:[]}]}
        ])s.put(r);tx.oncomplete=ok;tx.onerror=()=>no(tx.error)});db.close()}''')
        p.evaluate('async()=>{await set("export-data","exportDataOn",true);pick("export-data")}')
        with p.expect_download(timeout=8000) as info:
            p.locator('[data-feat="export-data"]').get_by_role('button',name='Notes & bookmarks',exact=True).click()
        with tempfile.TemporaryDirectory() as d:
            path=Path(d)/'export.json';info.value.save_as(path);out=json.loads(path.read_text())
        assert out['format']=='yourtube-local-notes-v1'
        assert out['notes'][0]['v']=='video note'
        assert out['timestampNotes']['LabVideo001'][0]['text']=='timestamp note'
        assert out['bookmarks']['LabVideo001'][0]['t']==20
        assert out['collections'][0]['name']=='Collection'
        row.update(pass_=True,sections=['notes','timestampNotes','bookmarks','collections'],filename=info.value.suggested_filename)
        row['pass']=row.pop('pass_')
    except Exception as ex:
        row.update(error=str(ex)[:250]);row['pass']=False
    return [row]
