// Lightweight, local diagnostics: no payloads, authentication material or
// response bodies are collected. Errors are reported once per status change.
const IntegrationDiagnostics = (() => {
  const entries = [], states = new Map(), limit = 500;
  function report(integration, state, detail = '') {
    const name = String(integration), message = String(detail), old = states.get(name);
    const item = { at: Date.now(), integration: name, state: String(state), detail: message };
    entries.push(item);
    if (entries.length > limit) entries.splice(0, entries.length - limit);
    states.set(name, item);
    g.emit('integration.status', item);
    if (state === 'error' && (!old || old.state !== 'error' || old.detail !== message))
      try { pe(name + ': ' + message, 4000, 'error'); } catch (_) {}
    return item;
  }
  async function request(name, url, active) {
    let result;
    for (let attempt = 1; attempt <= 3; attempt++) {
      if (active && !active()) return { ok: false, cancelled: true, status: 0 };
      result = await YourTubeEngine.fetchJson(url);
      if (active && !active()) return { ok: false, cancelled: true, status: 0 };
      if (result?.ok) {
        report(name, 'ok', 'Request succeeded on attempt ' + attempt);
        return result;
      }
      if (result?.blocked) {
        report(name, 'unavailable', 'Blocked by privacy settings');
        return result;
      }
      const code = Number(result?.status) || 0;
      const transient = code === 0 || code >= 500;
      if (attempt < 3 && transient) {
        report(name, 'retrying', 'Attempt ' + attempt + ' failed' + (code ? ' (HTTP ' + code + ')' : ' (network)'));
        await new Promise(resolve => setTimeout(resolve, attempt === 1 ? 500 : 1500));
        continue;
      }
      report(name, 'error', code ? 'Request failed (HTTP ' + code + ')' : 'Network request failed');
      return result || { ok: false, status: 0 };
    }
    return result;
  }
  function status(name) { return states.get(name) || null; }
  function mount(panel, name) {
    const node = To('div', 'ytb-hist-note');
    node.setAttribute('role', 'status');
    const render = () => { const s = status(name); node.textContent = name + ': ' + (s ? s.state + (s.detail ? ' — ' + s.detail : '') : 'No request in this session'); };
    render(); panel.appendChild(node);
    So('integration.status', item => { if (item.integration === name) render(); });
  }
  function checkClient() {
    try {
      const version = e.ytcfg?.get?.('INNERTUBE_CLIENT_VERSION');
      if (typeof version !== 'string' || !version || version.length > 100) return;
      const key = 'yourtube.youtube-client-version', previous = localStorage.getItem(key);
      if (previous !== version) {
        localStorage.setItem(key, version);
        report('YouTube client', previous ? 'changed' : 'detected', previous ? previous + ' → ' + version : version);
      }
    } catch (_) {}
  }
  return { report, request, status, mount, checkClient, entries: () => entries.slice(), clear: () => { entries.length = 0; g.emit('integration.cleared'); } };
})();
