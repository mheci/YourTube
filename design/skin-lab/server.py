"""Serve the guided setup fixture, bundle, and standalone design prototypes; no repository directory listings."""
from pathlib import Path
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit
import mimetypes
import os
import re

ROOT = Path(__file__).resolve().parent
class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        path = urlsplit(self.path).path.lstrip('/') or 'guided.html'
        if path == 'bundle.js':
            file = ROOT.parents[1] / 'yourtube.user.js'
        elif path in ('guided.html', 'index.html', 'preview.html', 'skins.js', 'concepts.css', 'concepts.js') or re.fullmatch(r'shots/\d{2}\.jpg', path):
            file = ROOT / path
        else:
            return self.send_error(404)
        if not file.is_file():
            return self.send_error(404)
        data = file.read_bytes()
        self.send_response(200)
        self.send_header('Content-Type', mimetypes.guess_type(file.name)[0] or 'application/octet-stream')
        self.send_header('Content-Length', str(len(data)))
        self.send_header('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'none'")
        self.end_headers()
        self.wfile.write(data)

if __name__ == '__main__':
    ThreadingHTTPServer(('0.0.0.0', int(os.environ.get('PORT', '4173'))), Handler).serve_forever()
