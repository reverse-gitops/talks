---
layout: default
transition: fade
---

###### From the people who built the Kubernetes API

# How they <span class="green">designed it.</span>

<div class="quotes">
  <div class="quote">
    <blockquote>“declarative abstractions are primary, rather than layered on top of the system”</blockquote>
    <span>Say what you want. That's the foundation.</span>
  </div>
  <div v-click class="quote">
    <blockquote>“no hidden internal resource-oriented APIs”</blockquote>
    <span>Your code gets the same API as Kubernetes' own.</span>
  </div>
  <div v-click class="quote">
    <blockquote>“designed for humans to directly author and read”</blockquote>
    <span>No second format to keep in sync.</span>
  </div>
</div>

<p v-click class="punch"><span class="green">“Comprehensive version control is the responsibility of other systems (e.g., git).”</span></p>

<Sources label="read it" :items="[{ name: 'The Kubernetes Resource Model, Brian Grant, 2018', href: 'https://github.com/kubernetes/design-proposals-archive/blob/main/architecture/resource-management.md' }]" />

<style>
.slidev-layout h1 { margin-bottom: 20px; }
.quotes { display: flex; flex-direction: column; gap: 20px; }
.quote { padding: 18px 28px; background: var(--panel); border: 1px solid var(--line); border-radius: 14px; }
.slidev-layout .quote blockquote { margin: 0; padding: 0; border: none; background: none; font-size: 32px; line-height: 1.25; font-weight: 500; font-style: normal; color: var(--text); }
.quote span { display: block; margin-top: 6px; font-size: 26px; line-height: 1.3; color: var(--soft); }
.punch { margin: 26px 0 0; text-align: center; font-size: 34px; line-height: 1.2; font-weight: 700; opacity: 1; }
</style>

<!--
**10:00 · 0:45**

Brian Grant, 2018. All literal quotes. Not an accident.

Declarative comes first.

[click] No hidden APIs, no special door. So your workload can use it too.

[click] Written for humans. The API object is the configuration format.

[click] My favourite. Git next to this API isn't abuse: it's in the design document.

Also in there: no transactions across resources. Comes back in part 4.

Behind? Skip this slide, say the Git quote out loud.
-->
