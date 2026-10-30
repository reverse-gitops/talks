// Deck: owns the stage, mounts one slide at a time and routes input to it.
//
// Keys  → / PageDown / Space / Enter   next step (next slide at the end)
//       ← / PageUp / Backspace          previous step (previous slide at the start)
//       F                               fullscreen
//       Home / End                      first / last slide
//       1–9                             jump to slide n
// Mouse click = next step, right-click = previous step.
// The URL hash (#problem, #big-picture, …) remembers the current slide.

import { SlideEngine } from './engine.js';

export class Deck {
  constructor(stage, slides) {
    this.stage = stage;
    this.slides = slides;
    this.index = -1;
    this.engine = null;
    this.style = document.createElement('style');
    this.style.id = 'slide-style';
    document.head.append(this.style);
    this.busy = false;
  }

  start() {
    this.fit();
    window.addEventListener('resize', () => this.fit());
    window.addEventListener('keydown', (e) => this.onKey(e));
    window.addEventListener('hashchange', () => this.fromHash());
    this.stage.addEventListener('click', (e) => {
      if (e.target.closest('a,button,input,label,[data-no-step]')) return;
      this.step(1);
    });
    this.stage.addEventListener('contextmenu', (e) => { e.preventDefault(); this.step(-1); });
    this.fromHash(true);
  }

  fit() {
    const f = Math.min(window.innerWidth / 1600, window.innerHeight / 900);
    document.documentElement.style.setProperty('--fit', String(f));
  }

  fromHash(first) {
    const id = decodeURIComponent(location.hash.slice(1));
    const i = Math.max(0, this.slides.findIndex((s) => s.id === id));
    if (i !== this.index || first) this.show(i);
  }

  show(i, { at = 'start' } = {}) {
    if (i < 0 || i >= this.slides.length) return;
    if (this.engine) this.engine.destroy();
    const slide = this.slides[i];
    this.index = i;
    this.style.textContent = slide.css;
    this.stage.innerHTML = slide.html;
    const root = this.stage.querySelector('[data-anim-root]');
    root.dataset.slide = slide.id;
    document.title = `${i + 1}/${this.slides.length} · ${slide.title}`;
    const pager = document.getElementById('pager');
    if (pager) pager.textContent = `${i + 1} / ${this.slides.length}`;
    if (location.hash.slice(1) !== slide.id) history.replaceState(null, '', '#' + slide.id);
    this.engine = new SlideEngine({ root, slide, deck: this });
    this.engine.mount({ at });
  }

  step(dir) { if (this.engine && !this.busy) this.engine.step(dir); }

  async next() {
    if (this.busy || this.index >= this.slides.length - 1) return;
    this.busy = true;
    try { await this.engine.leave(); } finally { this.busy = false; }
    this.show(this.index + 1);
  }

  prev() {
    if (this.busy || this.index <= 0) return;
    this.show(this.index - 1, { at: 'end' }); // going back lands on the finished slide
  }

  onKey(e) {
    if (e.target && e.target.closest && e.target.closest('input')) return;
    const k = e.key;
    if (k === 'ArrowRight' || k === 'PageDown' || k === ' ' || k === 'Enter') { e.preventDefault(); this.step(1); }
    else if (k === 'ArrowLeft' || k === 'PageUp' || k === 'Backspace') { e.preventDefault(); this.step(-1); }
    else if (k === 'f' || k === 'F') { this.toggleFullscreen(); }
    else if (k === 'Home') { this.show(0); }
    else if (k === 'End') { this.show(this.slides.length - 1); }
    else if (/^[1-9]$/.test(k) && Number(k) <= this.slides.length) { this.show(Number(k) - 1); }
  }

  toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen().catch(() => {});
  }
}
