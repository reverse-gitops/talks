import html from './slide.html?raw';
import css from './slide.css?inline';

export default {
  id: "delivery",
  title: "Settings shipped as OCI artifacts",
  seconds: 28,
  next: null,
  html,
  css,
  // Labels under the timeline; `at` is a fraction of the slide timeline.
  marks: [
    { label: "01 publish", at: 0 },
    { label: "02 registry", at: 0.144 },
    { label: "03 Flux bumps", at: 0.2514 },
    { label: "04 mounted", at: 0.43 },
    { label: "05 the app reads it", at: 0.587 }
  ]
};
