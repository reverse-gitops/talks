import html from './slide.html?raw';
import css from './slide.css?inline';

export default {
  id: "commit-request",
  title: "Reverser: CommitRequest closes the window with a reason",
  seconds: 16,
  next: "Delivery \u2192",
  html,
  css,
  // Labels under the timeline; `at` is a fraction of the slide timeline.
  marks: [
    { label: "01 changes", at: 0 },
    { label: "02 CommitRequest", at: 0.3003 },
    { label: "03 window closed", at: 0.4701 },
    { label: "04 committed", at: 0.57 }
  ]
};
