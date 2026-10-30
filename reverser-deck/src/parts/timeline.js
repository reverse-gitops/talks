// Timeline part: step labels with ticks, a progress bar that jumps quickly to the
// next stop, and an invisible scrub slider over the track (visible on keyboard focus).
//
//   const tl = mountTimeline(el, { marks, onScrub });
//   tl.update({ bar: 0..1, barMs: '.28s', scrub: 0..1000 });

const WIDTH = 1472;

export function mountTimeline(host, { marks = [], onScrub }) {
  host.classList.add('timeline');
  host.setAttribute('data-no-step', '');
  const top = host.style.top || '816px'; // each slide places the timeline itself
  host.removeAttribute('style');
  host.style.top = top;

  const frag = document.createDocumentFragment();
  for (const m of marks) {
    const x = Math.round(Number(m.at || 0) * WIDTH);
    const label = document.createElement('div');
    label.className = 'mark';
    label.style.left = x + 'px';
    label.textContent = m.label;
    frag.append(label);
    if (x > 0) {
      const tick = document.createElement('div');
      tick.className = 'tick';
      tick.style.left = (x - 2) + 'px';
      frag.append(tick);
    }
  }
  const track = el('div', 'track');
  const bar = el('div', 'bar');
  bar.setAttribute('aria-hidden', 'true');
  const id = 'scrub-' + Math.random().toString(36).slice(2, 8);
  const hint = el('label', 'hint');
  hint.htmlFor = id;
  hint.textContent = 'click or → for the next step · right-click or ← to go back';
  const scrub = el('input', 'scrub');
  Object.assign(scrub, { id, type: 'range', min: 0, max: 1000, step: 1, value: 0 });
  scrub.setAttribute('aria-label', 'Scrub through the animation');
  scrub.addEventListener('input', (e) => onScrub && onScrub(Number(e.target.value) || 0));
  frag.append(track, bar, hint, scrub);
  host.replaceChildren(frag);

  return {
    update({ bar: f = 0, barMs = '0s', scrub: v = 0 }) {
      host.style.setProperty('--bar-ms', barMs);
      bar.style.transform = `scaleX(${Math.max(0, Math.min(1, f))})`;
      if (document.activeElement !== scrub) scrub.value = String(v);
    }
  };
}

function el(tag, cls) {
  const n = document.createElement(tag);
  n.className = cls;
  return n;
}
