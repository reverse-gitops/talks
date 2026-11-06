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

<!--
This wasn't an accident. There's a design document from 2018 by Brian Grant, one of the people behind this API, called The Kubernetes Resource Model. Everything here is a literal quote.

One: declarative comes first. It isn't layered on top.

[click] Two: no hidden APIs. The document also says that clients and controllers "interact with the same APIs". So there's no special door for Kubernetes itself. That's why your workload can use it too.

[click] Three: written for humans to author and read. The API object is the configuration format.

[click] And this one is my favourite. They say it themselves: version control isn't the job of the API, it's the job of something like Git. So putting Git next to this API isn't abuse. It's in the design document.

Honest note, also in that document: no "atomic transactions across multiple resources", and no referential integrity. We'll come back to that when we talk about where this breaks.
-->

<style>
.slidev-layout h1 { margin-bottom: 20px; }
.quotes { display: flex; flex-direction: column; gap: 20px; }
.quote { padding: 18px 28px; background: var(--panel); border: 1px solid var(--line); border-radius: 14px; }
.slidev-layout .quote blockquote { margin: 0; padding: 0; border: none; background: none; font-size: 32px; line-height: 1.25; font-weight: 500; font-style: normal; color: var(--text); }
.quote span { display: block; margin-top: 6px; font-size: 26px; line-height: 1.3; color: var(--soft); }
.punch { margin: 26px 0 0; text-align: center; font-size: 34px; line-height: 1.2; font-weight: 700; opacity: 1; }
</style>
