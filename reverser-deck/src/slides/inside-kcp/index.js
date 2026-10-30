import html from './slide.html?raw';
import css from './slide.css?inline';

export default {
  id: "inside-kcp",
  title: "Inside the config cluster: KCP and Reverser",
  seconds: 20,
  next: "Two streams \u2192",
  html,
  css,
  // Labels under the timeline; `at` is a fraction of the slide timeline.
  marks: [
    { label: "01 KCP", at: 0 },
    { label: "02 Reverser", at: 0.2514 },
    { label: "03 two questions", at: 0.5014 },
    { label: "04 two streams", at: 0.7514 }
  ]
};
