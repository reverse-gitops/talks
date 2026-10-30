import html from './slide.html?raw';
import css from './slide.css?inline';

export default {
  id: "modeling",
  title: "Design it so it can remember",
  seconds: 20,
  next: "Inside KCP \u2192",
  html,
  css,
  // Labels under the timeline; `at` is a fraction of the slide timeline.
  marks: [
    { label: "01 the rule", at: 0 },
    { label: "02 what we meant", at: 0.2711 },
    { label: "03 what happened", at: 0.5014 },
    { label: "04 decrypt", at: 0.7514 }
  ]
};
