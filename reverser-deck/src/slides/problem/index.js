import html from './slide.html?raw';
import css from './slide.css?inline';

export default {
  id: "problem",
  title: "The problem: one typo, no more customer emails",
  seconds: 20,
  next: "The fix \u2192",
  html,
  css,
  // Labels under the timeline; `at` is a fraction of the slide timeline.
  marks: [
    { label: "01 emails flow", at: 0 },
    { label: "02 one typo", at: 0.301 },
    { label: "03 silent failure", at: 0.4511 },
    { label: "04 no answers", at: 0.7011 }
  ],
  extraState() { return { count: 42 }; },
  vals() { return { failCount: this.state.count }; },
  // Failing-emails counter: +1 each time a failing email reaches SendGrid.
  onFrame() {
    if (this.curTime() < 0.46 * this.loopMs()) {
      this.hits = null;
      if (this.state.count !== 0) this.setState({ count: 0 });
      return;
    }
    if (!this.hits) this.hits = new Map();
    let add = 0;
    this.root.querySelectorAll('.emf').forEach((el) => {
      const an = el.getAnimations()[0];
      if (!an || !an.effect) return;
      const t = an.effect.getComputedTiming();
      const pos = (t.currentIteration || 0) + (t.progress || 0);
      const prev = this.hits.get(el);
      if (prev != null) add += Math.max(0, Math.floor(pos - 0.67) - Math.floor(prev - 0.67));
      this.hits.set(el, pos);
    });
    if (add) this.setState({ count: (this.state.count || 0) + add });
  }
};
