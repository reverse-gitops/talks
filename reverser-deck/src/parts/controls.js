// Controls part (top right): "next slide" button and the Play/Pause button for
// running the slide as a continuous animation (handy on a website).
//
//   const c = mountControls(root, { nextLabel, onNext, onToggle });
//   c.update({ playing, ended });

const PAUSE = '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="2" y="1" width="3.5" height="12" rx="1"></rect><rect x="8.5" y="1" width="3.5" height="12" rx="1"></rect></svg>';
const PLAY = '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M3 1.5 L12.5 7 L3 12.5 Z"></path></svg>';

export function mountControls(root, { nextLabel, onNext, onToggle }) {
  if (nextLabel) {
    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'playbtn next';
    next.textContent = nextLabel;
    next.setAttribute('aria-label', 'Go to the next slide');
    next.addEventListener('click', onNext);
    root.append(next);
  }
  const play = document.createElement('button');
  play.type = 'button';
  play.className = 'playbtn play';
  play.addEventListener('click', onToggle);
  root.append(play);

  let last = '';
  return {
    update({ playing, ended }) {
      const label = playing ? 'Pause' : (ended ? 'Replay' : 'Play');
      const key = label + playing;
      if (key === last) return;
      last = key;
      play.innerHTML = (playing ? PAUSE : PLAY) + label;
      play.setAttribute('aria-label', label + ' animation');
    }
  };
}
