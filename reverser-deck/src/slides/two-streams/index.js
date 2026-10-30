import html from './slide.html?raw';
import css from './slide.css?inline';

export default {
  id: "two-streams",
  title: "Reverser: two streams, one commit per window",
  seconds: 30,
  next: "CommitRequest \u2192",
  html,
  css,
  // Labels under the timeline; `at` is a fraction of the slide timeline.
  marks: [
    { label: "01 change", at: 0 },
    { label: "02 joined", at: 0.0999 },
    { label: "03 commit", at: 0.4348 },
    { label: "04 Bob: 3 changes", at: 0.5346 },
    { label: "05 commit", at: 0.8668 }
  ],
  // CSS variables set on the slide root (the 1s audit-batch pulse scales with the slide).
  vars(s) { return { '--tick': (s / 30) + 's' }; }
};
