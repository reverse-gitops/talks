---
layout: default
transition: fade
---

###### The consumer

# What do consumers <span class="green">expect these days?</span>

<div class="sides">
  <div class="side">
    <div class="head blue">Make it easy</div>
    <ul>
      <li>A screen I can just click</li>
      <li>An API for my scripts and AI agents</li>
      <li>My own login, with my own rights</li>
      <li>An instant answer if it's wrong</li>
    </ul>
  </div>
  <div v-click class="side">
    <div class="head green">Leave me in control</div>
    <ul>
      <li>Who changed what, and why</li>
      <li>Undo, in one step</li>
      <li>My settings, in files I own</li>
    </ul>
  </div>
</div>

<p v-click class="punch">Not one or the other. <span class="amber">Both.</span></p>

<style>
.sides { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 48px; }
.side { padding: 36px 40px; background: var(--panel); border: 1px solid var(--line); border-radius: 16px; }
.head { margin-bottom: 20px; font-size: 42px; line-height: 1.2; font-weight: 700; }
.side ul { margin: 0; padding-left: 1.1em; }
.slidev-layout .side li { margin: 16px 0; font-size: 32px; line-height: 1.25; color: var(--text); }
.punch { position: absolute; left: 64px; right: 64px; bottom: 60px; margin: 0; text-align: center; font-size: 46px; line-height: 1.2; font-weight: 700; opacity: 1; }
</style>

<!--
Someone who wants to change something they don't run, like you and your chair: what do they expect today? Ask the room first, if there's time.

Easy: a screen when I want to click, and no guilt about clicking. An API when I want to script it, or when my AI agent does. My own login. And an answer right away when I've got it wrong, not a failed pipeline ten minutes later.

[click] But also control: who changed this, and why? Can I undo it? And can I keep my settings in files that are mine?

[click] Normally a product picks one. Screens are easy, and files give you control. People want both.

Next: the other side of that API, the provider.
-->
