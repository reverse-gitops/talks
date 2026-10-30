// Slide engine: turns one slide's CSS-keyframe timeline into a step-through
// presentation.
//
// A slide is one long timeline (all `.an` elements share the duration --T).
// The markup tells the engine how to present it:
//   data-steps="f,f,…" on the root   stop points (fractions of the timeline)
//   data-live="from,to"               keeps running in real time while you stand
//                                     on a stop inside [from,to) (timers, counters)
//   data-freeze="f"                   looping animation that pauses on stop f
//   .intro                            arrival zoom, plays once when the slide opens
//   [data-zoom][data-zoom-origin]     zoomed into when leaving to the next slide
//   .prog                             invisible master clock
//   [data-bind="key"]                 text filled from slide.vals()/state
//   [data-part="timeline"]            where the shared Timeline part goes
//
// Pressing next plays to the following stop (capped at MAX_STEP_MS, so long
// stretches play faster). Pressing again while a step runs finishes it at once.
// Infinite loops (traffic, emails) always keep running.

import { mountTimeline } from './parts/timeline.js';
import { mountControls } from './parts/controls.js';

const MAX_STEP_MS = 2500;
const BAR_MS = '.28s';

export class SlideEngine {
  constructor({ root, slide, deck }) {
    this.root = root;
    this.slide = slide;
    this.deck = deck;
    this.state = Object.assign({ playing: false, ended: false, scrub: 0, bar: 0, pres: true },
      slide.extraState ? slide.extraState.call(this) : {});
    this.presenting = true;
    this.point = 0;
    this.stepTimer = null;
    this.stepTarget = null;
    this.raf = null;
  }

  // ── lifecycle ──────────────────────────────────────────────────────────
  mount({ at = 'start' } = {}) {
    const s = this.secs();
    this.root.style.setProperty('--T', s + 's');
    const vars = this.slide.vars ? this.slide.vars(s) : {};
    for (const [k, v] of Object.entries(vars)) this.root.style.setProperty(k, v);

    const tlHost = this.root.querySelector('[data-part="timeline"]');
    this.timeline = tlHost && mountTimeline(tlHost, { marks: this.slide.marks || [], onScrub: (v) => this.scrubTo(v) });
    this.controls = mountControls(this.root, {
      nextLabel: this.slide.next,
      onNext: (e) => { e.stopPropagation(); this.deck.next(); },
      onToggle: (e) => { e.stopPropagation(); this.togglePlay(); }
    });
    const prog = this.root.querySelector('.prog');
    if (prog) prog.addEventListener('animationend', () => this.setState({ playing: false, ended: true }));

    if (at === 'end') {
      this.seekAll(this.loopMs(), false);
    } else {
      this.seekAll(0, false);
      this.anims().forEach((a) => { if (this.isIntro(a)) { a.currentTime = 0; a.play(); } });
    }
    this.raf = requestAnimationFrame(() => this.govern());
    this.render();
  }

  destroy() {
    if (this.raf) cancelAnimationFrame(this.raf);
    if (this.stepTimer) clearTimeout(this.stepTimer);
    this.raf = null; this.stepTimer = null; this.dead = true;
  }

  // ── state & rendering ─────────────────────────────────────────────────
  setState(patch) {
    Object.assign(this.state, patch);
    this.render();
  }

  render() {
    const st = this.state;
    if (this.timeline) this.timeline.update({ bar: st.bar, barMs: st.pres ? BAR_MS : '0s', scrub: st.scrub });
    if (this.controls) this.controls.update(st);
    const vals = this.slide.vals ? this.slide.vals.call(this) : {};
    this.root.querySelectorAll('[data-bind]').forEach((el) => {
      const v = vals[el.dataset.bind];
      if (v != null && el.textContent !== String(v)) el.textContent = String(v);
    });
  }

  // ── timeline helpers ──────────────────────────────────────────────────
  secs() { return this.slide.seconds || 20; }
  loopMs() { return this.secs() * 1000; }

  anims() {
    // CSS animations only: the timeline bar's CSS transition and the zoom-out
    // (Web Animations) must not be driven by the engine.
    return this.root.getAnimations({ subtree: true })
      .filter((a) => typeof CSSAnimation === 'undefined' || a instanceof CSSAnimation);
  }

  navPoints() {
    const T = this.loopMs();
    const raw = this.root.getAttribute('data-steps') || '';
    const pts = [0];
    raw.split(',').filter(Boolean).forEach((f) => pts.push(Number(f) * T));
    pts.push(T);
    return pts;
  }

  curTime() {
    const el = this.root.querySelector('.prog');
    const a = el && el.getAnimations()[0];
    return a && a.currentTime != null ? Math.min(a.currentTime, this.loopMs()) : this.loopMs();
  }

  isIntro(a) {
    const el = a.effect && a.effect.target;
    return !!(el && el.classList && el.classList.contains('intro'));
  }

  isLoop(a) {
    const t = a.effect && a.effect.getComputedTiming ? a.effect.getComputedTiming() : null;
    return !!t && t.iterations === Infinity;
  }

  liveRange(a) {
    const el = a.effect && a.effect.target;
    const v = el && el.getAttribute && el.getAttribute('data-live');
    if (!v) return null;
    const T = this.loopMs();
    const p = v.split(',').map(Number);
    return [p[0] * T, p[1] * T];
  }

  // Runs every frame: freezes, keeps paused stops paused, caps live elements,
  // follows the timeline in Play mode and calls the slide's onFrame hook.
  govern() {
    if (this.dead) return;
    const root = this.root;
    const here = this.presenting && !this.stepTimer && this.point != null;
    root.querySelectorAll('[data-freeze]').forEach((el) => {
      const stop = here && Math.abs(this.point - Number(el.getAttribute('data-freeze')) * this.loopMs()) < 2;
      el.getAnimations().forEach((a) => {
        if (stop && a.playState === 'running') a.pause();
        else if (!stop && a.playState === 'paused') a.play();
      });
    });
    if (here) {
      this.anims().forEach((a) => {
        if (a.playState !== 'running' || this.isLoop(a) || this.isIntro(a) || this.liveRange(a)) return;
        a.pause(); a.currentTime = this.point;
      });
    }
    if (this.presenting) {
      const p = this.stepTimer ? this.stepTarget : this.point;
      this.anims().forEach((a) => {
        const r = this.liveRange(a);
        if (!r || a.playState !== 'running' || a.currentTime == null || p == null) return;
        const lim = p >= r[0] && p < r[1] ? r[1] : p;
        if (a.currentTime >= lim) { a.pause(); a.currentTime = lim; }
      });
    }
    if (!this.presenting && this.state.playing) {
      const f = this.curTime() / this.loopMs();
      if (Math.abs(f - (this.state.bar || 0)) > 0.002) this.setState({ bar: f });
    }
    if (this.slide.onFrame) this.slide.onFrame.call(this);
    this.raf = requestAnimationFrame(() => this.govern());
  }

  // Jump straight to a moment on the timeline and stand there.
  seekAll(ms, keep) {
    if (this.stepTimer) { clearTimeout(this.stepTimer); this.stepTimer = null; }
    this.presenting = true;
    this.point = ms;
    this.anims().forEach((a) => {
      a.playbackRate = 1;
      if (this.isIntro(a)) { if (a.playState !== 'running') { a.pause(); a.currentTime = this.loopMs(); } return; }
      if (this.isLoop(a)) { a.play(); return; }
      const r = this.liveRange(a);
      if (r && ms >= r[0] && ms < r[1]) {
        const own = keep && a.currentTime != null ? a.currentTime : ms;
        a.currentTime = Math.min(Math.max(own, ms), r[1]);
        a.play();
      } else { a.pause(); a.currentTime = ms; }
    });
    const T = this.loopMs();
    this.setState({ playing: false, pres: true, bar: ms / T, ended: ms >= T - 1, scrub: Math.round((ms / T) * 1000) });
  }

  // dir = +1: play to the next stop (or go to the next slide); -1: back one stop.
  step(dir) {
    if (this.stepTimer && this.stepTarget != null) this.seekAll(this.stepTarget, true);
    const pts = this.navPoints();
    const t = this.curTime();
    if (dir > 0) {
      const nxt = pts.find((p) => p > t + 200);
      if (nxt == null) { this.deck.next(); return; }
      const dur = nxt - t;
      const rate = Math.max(1, dur / MAX_STEP_MS);
      this.presenting = true;
      this.anims().forEach((a) => {
        if (this.isIntro(a)) return;
        if (this.isLoop(a)) { a.playbackRate = 1; a.play(); return; }
        const own = a.currentTime == null ? t : a.currentTime;
        a.currentTime = this.liveRange(a) ? Math.max(own, t) : t;
        a.playbackRate = rate; a.play();
      });
      this.stepTarget = nxt;
      this.stepTimer = setTimeout(() => { this.stepTimer = null; this.seekAll(nxt, true); }, dur / rate);
      this.setState({ playing: true, pres: true, bar: nxt / this.loopMs(), ended: false });
    } else {
      const prv = pts.slice().reverse().find((p) => p < t - 300);
      if (prv == null) { this.deck.prev(); return; }
      this.seekAll(prv, false);
    }
  }

  // ── continuous mode (Play button, scrub slider) ───────────────────────
  scrubTo(v) {
    if (this.stepTimer) { clearTimeout(this.stepTimer); this.stepTimer = null; }
    this.presenting = false;
    const t = (v / 1000) * this.loopMs();
    this.anims().forEach((a) => { a.pause(); a.currentTime = t; });
    this.setState({ scrub: v, bar: v / 1000, pres: false, playing: false, ended: v >= 1000 });
  }

  togglePlay() {
    const next = !this.state.playing;
    const list = this.anims();
    if (this.stepTimer) { clearTimeout(this.stepTimer); this.stepTimer = null; }
    this.presenting = false;
    if (next) {
      const t0 = this.state.ended ? 0 : this.curTime();
      list.forEach((a) => { a.playbackRate = 1; if (!this.isLoop(a)) a.currentTime = t0; });
    }
    list.forEach((a) => (next ? a.play() : a.pause()));
    this.setState({ playing: next, pres: false, ended: false });
  }

  // Zoom into the slide's [data-zoom] wrapper before leaving (if it has one).
  async leave() {
    const z = this.root.querySelector('[data-zoom]');
    if (!z || !z.animate) return;
    z.style.transformOrigin = z.getAttribute('data-zoom-origin') || z.style.transformOrigin;
    const anim = z.animate(
      [{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(5)', opacity: 0 }],
      { duration: 900, easing: 'cubic-bezier(.55,0,.85,.35)', fill: 'forwards' });
    await anim.finished.catch(() => {});
  }
}
