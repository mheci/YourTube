"""Local fixture only. Inspect real browser downloads/chooser and native pointer geometry."""

import json, hashlib


def run(p):
    rows = []

    def test(key, fn):
        r = {"id": "core", "key": key}
        try:
            fn(r)
            assert r.get("pass"), str(r)[:180]
        except Exception as e:
            r["error"] = str(e)[:230]
            r["pass"] = False
        rows.append(r)

    def on(v):
        p.evaluate('async v=>{await set("hide-comments","hideComments",v)}', v)

    p.evaluate("()=>{scene('<div id=comments style=\"display:block\">comment fixture</div>');}")
    on(True)
    body = None

    def export(r):
        nonlocal body
        with p.expect_download(timeout=4500) as ev:
            p.get_by_role("button", name="Export settings", exact=True).click()
        body = ev.value.path().read_bytes()
        d = json.loads(body)
        r.update(
            name=ev.value.suggested_filename,
            bytes=len(body),
            sha256=hashlib.sha256(body).hexdigest(),
            passField=d["cfg"].get("hideComments"),
        )
        r["pass"] = (
            r["passField"] is True and len(body) > 80 and d["version"] == p.evaluate("YourTube.version")
        )

    test("Export settings", export)

    def import_(r):
        on(False)
        r["before"] = p.locator("#comments").evaluate("n=>getComputedStyle(n).display")
        assert r["before"] == "block"
        with p.expect_file_chooser(timeout=4500) as ev:
            p.get_by_role("button", name="Import settings", exact=True).click()
        ev.value.set_files({"name": "local-export.json", "mimeType": "application/json", "buffer": body})
        p.wait_for_function('()=>getComputedStyle(q("#comments")).display==="none"', timeout=4000)
        r["on"] = "none"
        on(False)
        r["off"] = p.locator("#comments").evaluate("n=>getComputedStyle(n).display")
        r["pass"] = r["off"] == "block"

    test("Import settings", import_)

    def reset(r):
        on(True)
        assert p.locator("#comments").evaluate("n=>getComputedStyle(n).display") == "none"
        p.once("dialog", lambda d: d.dismiss())
        p.get_by_role("button", name="Reset to defaults").click()
        r["cancelled"] = p.locator("#comments").evaluate("n=>getComputedStyle(n).display")
        p.once("dialog", lambda d: d.accept())
        p.get_by_role("button", name="Reset to defaults").click()
        p.wait_for_function('()=>getComputedStyle(q("#comments")).display==="block"', timeout=4500)
        r["reset"] = "block"
        r["pass"] = r["cancelled"] == "none"

    test("Reset to defaults", reset)

    def dock(r):
        shell = p.locator(".ytb-dash")
        header = p.locator(".ytb-dhdr")
        box = header.bounding_box()
        p.mouse.move(box["x"] + 60, box["y"] + 18)
        p.mouse.down()
        p.mouse.move(box["x"] - 62, box["y"] + 88, steps=7)
        p.mouse.up()
        r["before"] = shell.bounding_box()
        p.get_by_role("button", name="Dock to top-right").click()
        r["after"] = shell.bounding_box()
        r["pass"] = (
            r["after"] != r["before"]
            and abs(r["after"]["x"] + r["after"]["width"] - p.viewport_size["width"] + 16) < 3
        )

    test("Dock to top-right", dock)

    def close(r):
        assert p.locator(".ytb-dash").count() == 1
        p.get_by_role("button", name="Close dashboard").click()
        r["remaining"] = p.locator(".ytb-dash").count()
        r["pass"] = r["remaining"] == 0

    test("Close dashboard", close)
    return rows
