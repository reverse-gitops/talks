---
layout: default
transition: fade
---

<div class="three">
  <img src="/images/three-questions.jpg" alt="A speaker on stage at Øredev in front of her slide: Three questions. Any release. Blast radius, decision audits, recovery checks." />
  <div class="who">
    <h6>Yesterday, at Øredev</h6>
    <h1>Christine Pinto</h1>
    <p class="topic">A talk on outages.</p>
    <blockquote>“We don't need to test that.”</blockquote>
  </div>
</div>

<!--
Christine Pinto had a talk yesterday on the topic of outages. Three questions, for any release.

A reference back to her talk: "we don't need to test that". Configuration is where we say that most. Can we build more safeguards around it?
-->

<style>
.three { display: grid; grid-template-columns: 960px 1fr; gap: 48px; align-items: center; height: 100%; }
.three img { width: 100%; border-radius: 12px; }
.who h1 { font-size: 60px; }
.topic { margin: 0; font-size: 36px; line-height: 1.3; color: var(--soft); opacity: 1; }
.slidev-layout .who blockquote { margin: 40px 0 0; padding: 0 0 0 24px; border-left: 4px solid var(--amber); background: none; font-size: 36px; line-height: 1.25; font-weight: 600; font-style: normal; color: var(--text); }
</style>
