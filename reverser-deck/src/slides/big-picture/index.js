import html from './slide.html?raw';
import css from './slide.css?inline';

export default {
  id: "big-picture",
  title: "Big picture: settings get their own home",
  seconds: 45,
  next: "Config as KRM \u2192",
  html,
  css,
  // Labels under the timeline; `at` is a fraction of the slide timeline.
  marks: [
    { label: "01 today", at: 0 },
    { label: "02 split", at: 0.1332 },
    { label: "03 reads", at: 0.2887 },
    { label: "04 platform", at: 0.4001 },
    { label: "05 same typo", at: 0.5333 },
    { label: "06 revert", at: 0.7779 }
  ],
  extraState() { return { count: 37 }; },
  vals() { return { failCount: this.state.count }; },
  // Failing-emails counter: climbs while you wait, freezes once the fix lands.
  onFrame() {
    const el = this.root.querySelector('.clock');
    const a = el && el.getAnimations && el.getAnimations()[0];
    if (!a || !a.effect || a.currentTime == null) return;
    const d = a.effect.getComputedTiming().duration || 1;
    let ms = a.currentTime;
    if (ms >= d - 1 && this.presenting && !this.stepTimer) {
      if (!this.overT) this.overT = performance.now();
      ms = d + (performance.now() - this.overT);
    } else { this.overT = null; ms = Math.min(ms, d); }
    const t = (ms / d) * 45;
    let c = t < 33.5 ? 0 : Math.floor((t - 33.5) * 5);
    if (this.curTime() / d >= 0.9156) {
      if (this.cFix == null) this.cFix = this.state.count || 37;
      c = this.cFix;
    } else { this.cFix = null; }
    if (c !== this.state.count) this.setState({ count: c });
  }
};
