---
layout: default
transition: fade
---

###### The same API, in a browser

# Leave off the name: <span class="green">every chair in the room.</span>

<div class="list">
  <img class="shot" src="/images/seats.png" alt="A browser showing a SeatList as JSON at demo.koudijs.dev/k8s, with the spec of one seat selected">
  <ul>
    <li><strong>The URL is the query.</strong> One name less, and you get a list</li>
    <li v-click><strong>Same shape, every type.</strong> Nothing to learn for the next one</li>
    <li v-click><strong>Spec is what you chose.</strong> The rest is bookkeeping by the API server</li>
  </ul>
</div>

<!--
Remove the seat's name from the URL, and you get all the seats. A SeatList. That's the arrow in the screenshot.

[click] And this works the same for every type. Coffee menus, roles, pods: the same pattern. Any tool that knows one, knows them all.

[click] The part I selected is the spec. That's what you chose, and that's what goes to Git. Everything around it is the API server's own bookkeeping.

These are the reserved seats, from when I took the screenshot. Yours are in there now. Open the URL if you want to see them.
-->

<style>
.slidev-layout h1 { margin-bottom: 24px; }
.list { display: grid; grid-template-columns: 800px 1fr; gap: 44px; align-items: start; }
.shot { display: block; width: 800px; height: auto; border: 1px solid var(--line-strong); border-radius: 12px; }
.list ul { margin: 0; padding-left: 1em; }
.slidev-layout .list li { margin: 0 0 30px; font-size: 30px; line-height: 1.3; }
</style>
