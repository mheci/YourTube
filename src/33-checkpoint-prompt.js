// One accessible decision surface, three layouts. Shadow DOM isolates the controls
// from both YouTube's player styles and all YourTube theme/overhaul combinations.
function createCheckpointPrompt(actions) {
  const host = document.createElement('div');
  host.id = 'yourtube-checkpoint';
  const root = host.attachShadow({ mode: 'open' }),
    style = document.createElement('style');
  style.textContent = `
:host{all:initial;display:block!important;position:absolute!important;inset:0!important;z-index:2147483000!important;pointer-events:none!important;color-scheme:normal;container:checkpoint / size}
*,*::before,*::after{box-sizing:border-box} [hidden]{display:none!important}
.stage{--ink:#1a302b;--muted:#49605a;--paper:#fff9e9;--rule:#c9d0bd;--key:#195848;--keyink:#fff;--lime:#cced95;position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:clamp(9px,3cqw,38px);background:linear-gradient(115deg,#07151193,#091a1459);font:14px/1.38 system-ui,-apple-system,sans-serif;color:var(--ink);pointer-events:auto}
.panel{position:relative;max-width:100%;width:450px;max-height:100%;overflow:auto;overscroll-behavior:contain;background:var(--paper);border:1px solid var(--rule);border-radius:11px;box-shadow:0 18px 52px #0a141c48;padding:20px 24px 17px;text-align:left;direction:ltr}
.top,.brand,.badge,.marks,.buttons,.clockrow{display:flex;align-items:center}.top{justify-content:space-between;gap:10px}.brand,.badge,.marks,.eyeline,.timecode,.small,.minimize,.chip{font:600 10px/1.4 ui-monospace,SFMono-Regular,Consolas,monospace;letter-spacing:.07em}.brand{gap:9px;text-transform:uppercase}.stamp{width:19px;height:23px;background:var(--key);clip-path:polygon(0 0,100% 0,100% 100%,50% 77%,0 100%);position:relative}.stamp:after{content:'';position:absolute;inset:6px 5px auto;height:2px;border-block:1px solid var(--paper)}
.badge{gap:5px;background:color-mix(in srgb,var(--key) 9%,var(--paper));color:var(--key);padding:4px 7px;border-radius:4px;letter-spacing:0}.lamp{width:6px;height:6px;background:var(--key);border-radius:50%}
.eyeline{color:var(--muted);text-transform:uppercase;margin:20px 0 3px}.headline{margin:0;font:normal clamp(26px,5.4cqw,46px)/1.03 Georgia,serif;letter-spacing:-.045em}.subject{font:600 13px/1.4 system-ui,sans-serif;margin:8px 0 0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;color:var(--muted)}
.timeline{margin:18px 0 16px}.track{height:5px;border-radius:5px;background:var(--rule);position:relative}.fill{height:100%;background:var(--key);border-radius:5px;position:relative}.fill:after{content:'';width:9px;height:9px;background:var(--key);border:2px solid var(--paper);outline:1px solid var(--key);border-radius:50%;position:absolute;right:-4px;top:-2px}.marks{color:var(--muted);justify-content:space-between;margin-top:7px;font-weight:500;letter-spacing:.01em}
.buttons{gap:8px;flex-wrap:wrap}.buttons button,.minimize,.chip{cursor:pointer}.buttons button{border:1px solid var(--rule);border-radius:5px;background:transparent;color:var(--ink);padding:9px 13px;min-height:40px;font:650 13px/1.2 system-ui,sans-serif}.buttons .primary{background:var(--key);color:var(--keyink);border-color:var(--key)}button:focus-visible{outline:3px solid #ef811b;outline-offset:3px}.buttons button:hover{box-shadow:inset 0 0 0 1px currentColor}.buttons button:disabled{opacity:.62;cursor:wait}.footer{border-top:1px solid var(--rule);margin-top:16px;padding-top:9px;display:flex;align-items:center;justify-content:space-between;gap:6px}.small{font-weight:450;letter-spacing:0;color:var(--muted)}.minimize{border:0;background:none;color:var(--muted);text-decoration:underline;text-underline-offset:3px;letter-spacing:0;padding:4px;white-space:nowrap}.timecode{display:none}.chip{border:1px solid #a9c8b9;background:#122d27;color:#ecf7ea;border-radius:6px;padding:11px 15px;box-shadow:0 4px 16px #0003;letter-spacing:.01em}.stage.folded{background:transparent;pointer-events:none;align-items:flex-end;justify-content:flex-start}.chip{pointer-events:auto}
.stage[data-style=signal]{--ink:#eff7e7;--muted:#acbfb3;--paper:#112421;--key:#d4f19c;--keyink:#142622;--rule:#3f5950;background:linear-gradient(90deg,#0715109c,#08191761)}.stage[data-style=signal] .panel{border-radius:7px;background:repeating-linear-gradient(90deg,transparent 0 24px,#a4caab09 24px 25px),var(--paper);border-top:3px solid var(--key)}.stage[data-style=signal] .headline{font:600 clamp(32px,6.8cqw,61px)/1.02 ui-monospace,monospace;letter-spacing:-.08em;font-variant-numeric:tabular-nums}.stage[data-style=signal] .timecode{display:inline;color:var(--muted);margin-left:10px;font-size:11px;align-self:flex-end;line-height:2}.stage[data-style=signal] .track{height:9px;border-radius:0}.stage[data-style=signal] .track:after{content:'';position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent 0 8px,var(--paper) 8px 10px)}
.stage[data-style=dock]{--paper:#152723;--ink:#f2f5e9;--muted:#c2d1c5;--key:#d0eca4;--keyink:#172822;--rule:#465b50;align-items:flex-end;background:linear-gradient(0deg,#0c191a85,transparent 60%)}.stage[data-style=dock] .panel{width:min(720px,100%);padding:13px 17px;border-radius:8px;display:grid;grid-template-columns:1fr auto;column-gap:16px;align-items:center}.stage[data-style=dock] .top{grid-column:1/-1;margin-bottom:8px}.stage[data-style=dock] .eyeline,.stage[data-style=dock] .timeline{display:none}.stage[data-style=dock] .headline{font:650 19px/1.12 system-ui,sans-serif;letter-spacing:-.03em}.stage[data-style=dock] .subject{font-size:11px;margin-top:3px}.stage[data-style=dock] .footer{grid-column:1/-1;margin-top:9px;padding-top:5px}
@container checkpoint (max-width:490px){.panel{padding:13px 15px}.eyeline{margin:9px 0 2px}.headline{font-size:27px}.timeline{margin:11px 0}.footer{margin-top:9px;padding-top:5px}.stage[data-style=dock] .panel{display:block}.stage[data-style=dock] .buttons{margin-top:9px}.buttons button{min-height:36px;padding:7px 11px}.subject{margin-top:4px}.stage{padding:7px}}
@container checkpoint (max-height:265px){.eyeline{display:none}.top{margin-bottom:7px}.headline{font-size:25px}.timeline{margin:9px 0}.panel{padding:10px 13px}.buttons button{min-height:40px}.footer{margin-top:8px;padding-top:4px}.subject{margin:3px 0}.stage[data-style=signal] .headline{font-size:30px}}
@container checkpoint (max-height:185px){.timeline,.subject{display:none}.headline{font-size:19px}.buttons{margin-top:6px}.panel{padding:6px 10px}.top{margin-bottom:3px}}
@media(forced-colors:active){.panel,.buttons button,.chip{border:1px solid ButtonText}.fill,.stamp{background:Highlight}.badge{color:CanvasText}}`;
  root.append(style);
  const node = (tag, cls, text, parent) => {
    const n = document.createElement(tag);
    n.className = cls;
    if (text) n.textContent = text;
    parent.append(n);
    return n;
  };
  const stage = node('div', 'stage', '', root),
    panel = node('section', 'panel', '', stage);
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-labelledby', 'cp-title');
  panel.setAttribute('aria-describedby', 'cp-status');
  const top = node('div', 'top', '', panel),
    brand = node('div', 'brand', '', top);
  node('i', 'stamp', '', brand);
  node('span', '', 'Watch journal', brand);
  const badge = node('span', 'badge', '', top);
  node('i', 'lamp', '', badge);
  const state = node('span', '', 'On hold', badge);
  const text = node('div', 'copy', '', panel),
    eyebrow = node('p', 'eyeline', 'Your saved place', text),
    clock = node('div', 'clockrow', '', text);
  const title = node('h2', 'headline', '', clock);
  title.id = 'cp-title';
  node('span', 'timecode', '/ SAVED', clock);
  const subject = node('p', 'subject', '', text),
    line = node('div', 'timeline', '', panel),
    rail = node('div', 'track', '', line),
    fill = node('div', 'fill', '', rail);
  rail.setAttribute('role', 'progressbar');
  rail.setAttribute('aria-label', 'Saved video progress');
  rail.setAttribute('aria-valuemin', '0');
  rail.setAttribute('aria-valuemax', '100');
  const marks = node('div', 'marks', '', line),
    at = node('span', '', '', marks),
    end = node('span', '', '', marks),
    buttons = node('div', 'buttons', '', panel);
  const make = (parent, cls, action, fn) => {
    const b = node('button', cls, '', parent);
    b.type = 'button';
    b.dataset.action = action;
    b.addEventListener('click', (evt) => {
      evt.stopPropagation();
      fn();
    });
    return b;
  };
  let folded = false,
    model = null,
    parent = null,
    priorPosition = null,
    oldFocus = null;
  const yes = make(buttons, 'primary', 'resume', () => actions.choose('resume')),
    fresh = make(buttons, 'secondary', 'restart', () => actions.choose('restart'));
  const footer = node('div', 'footer', '', panel),
    note = node('span', 'small', '', footer);
  note.id = 'cp-status';
  note.setAttribute('role', 'status');
  const fold = make(footer, 'minimize', 'fold', () => collapse(true));
  fold.textContent = 'Minimize';
  const chip = make(stage, 'chip', 'expand', () => collapse(false));
  chip.hidden = true;
  function collapse(v) {
    folded = v;
    panel.hidden = v;
    chip.hidden = !v;
    stage.classList.toggle('folded', v);
    (v ? chip : yes.hidden ? fresh : yes).focus({ preventScroll: true });
  }
  for (const type of [
    'click',
    'dblclick',
    'pointerdown',
    'pointerup',
    'mousedown',
    'mouseup',
    'touchstart',
    'touchend',
  ])
    host.addEventListener(type, (ev) => ev.stopPropagation());
  host.addEventListener('keydown', (ev) => {
    ev.stopPropagation();
    if (ev.key === 'Escape') {
      ev.preventDefault();
      collapse(!folded);
    }
  });
  host.addEventListener('keyup', (ev) => ev.stopPropagation());
  function restoreParent() {
    if (parent && priorPosition !== null && parent.style.position === 'relative')
      parent.style.position = priorPosition;
    priorPosition = null;
  }
  function render(container, m) {
    if (container !== parent) {
      restoreParent();
      parent = container;
      if (getComputedStyle(parent).position === 'static') {
        priorPosition = parent.style.position;
        parent.style.position = 'relative';
      }
    }
    const mounted = host.parentNode === parent;
    if (!mounted) {
      oldFocus ||= document.activeElement;
      parent.append(host);
    }
    const key = JSON.stringify(m);
    if (model === key && mounted) return;
    model = key;
    const design = ['folio', 'signal', 'dock'].includes(m.style) ? m.style : 'folio',
      pos = ce(m.pos),
      dur = m.dur > 0 ? ce(m.dur) : '—';
    const pct = m.dur ? Math.max(0, Math.min(100, Math.round((m.pos / m.dur) * 100))) : 0;
    stage.dataset.style = design;
    host.dataset.phase = m.phase;
    host.dataset.design = design;
    const shortened = m.phase === 'shortened',
      retry = m.phase === 'seek-error',
      play = m.phase === 'play-blocked',
      wait = m.phase === 'seeking';
    title.textContent = shortened
      ? 'This film changed.'
      : play
        ? 'Ready to play.'
        : design === 'signal'
          ? pos
          : design === 'dock'
            ? 'Continue at ' + pos + '?'
            : 'Back to your place.';
    eyebrow.textContent = play
      ? 'Position restored'
      : design === 'signal'
        ? 'Transport / saved time'
        : 'Your saved place';
    subject.textContent = m.title || 'This video';
    subject.title = subject.textContent;
    at.textContent = pos + ' saved';
    end.textContent = pct + '%  ·  ' + dur;
    fill.style.width = pct + '%';
    rail.setAttribute('aria-valuenow', String(pct));
    state.textContent = play ? 'Paused' : wait ? 'Seeking' : 'On hold';
    note.textContent = shortened
      ? 'Your saved time is past the new ending.'
      : retry
        ? 'Seek not ready. Retry or start fresh.'
        : play
          ? 'Your browser needs a play gesture.'
          : wait
            ? 'Waiting for the player to seek…'
            : 'Playback waits for your choice.';
    yes.textContent = play ? 'Play at ' + pos : retry ? 'Retry ' + pos : 'Resume at ' + pos;
    fresh.textContent = 'Start fresh';
    fresh.title = 'Start this video at 0:00; keep your history and notes';
    yes.hidden = shortened;
    yes.disabled = wait;
    fresh.disabled = wait && m.pos === 0;
    fresh.className = shortened ? 'primary' : 'secondary';
    line.hidden = shortened;
    chip.textContent = 'Ⅱ  Paused at ' + pos + '  ·  Show choices';
    if (
      !mounted &&
      (!oldFocus ||
        oldFocus === document.body ||
        oldFocus === document.documentElement ||
        parent.contains(oldFocus))
    )
      (folded ? chip : yes.hidden ? fresh : yes).focus({ preventScroll: true });
  }
  function remove() {
    const restore = host.contains(document.activeElement) || document.activeElement === host;
    host.remove();
    restoreParent();
    if (restore && oldFocus?.isConnected)
      try {
        oldFocus.focus({ preventScroll: true });
      } catch (_) {}
    parent = null;
  }
  return { host, render, remove };
}
