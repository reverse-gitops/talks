---
layout: default
transition: fade
---

###### The test I discussed yesterday

# A whole webshop catalogue, <span class="green">in KRM?</span>

<div class="cols">
  <div class="col">
    <div class="head green">I think it fits</div>
    <ul>
      <li>Products and descriptions</li>
      <li>Categories and images</li>
      <li>Who changed this price?</li>
    </ul>
  </div>
  <div v-click class="col">
    <div class="head red">It doesn't</div>
    <ul>
      <li>Stock</li>
      <li>Orders and payments</li>
      <li>Changes every second, or all or nothing</li>
    </ul>
  </div>
  <div v-click class="col">
    <div class="head amber">The catch: search</div>
    <ul>
      <li>No full-text search</li>
      <li>No joins, no sorting</li>
      <li>So copy it to a search index</li>
    </ul>
  </div>
</div>

<p v-click class="punch">The line runs <span class="amber">through a single product.</span></p>

<style>
.cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; margin-top: 36px; }
.col { padding: 32px 36px; background: var(--panel); border: 1px solid var(--line); border-radius: 16px; }
.head { margin-bottom: 18px; font-size: 38px; line-height: 1.2; font-weight: 700; }
.col ul { margin: 0; padding-left: 1.1em; }
.slidev-layout .col li { margin: 16px 0; font-size: 30px; line-height: 1.25; color: var(--text); }
.punch { position: absolute; left: 64px; right: 64px; bottom: 76px; margin: 0; text-align: center; font-size: 50px; line-height: 1.2; font-weight: 700; opacity: 1; }
</style>

<!--
**28:45 · 2:00**

Discussion yesterday: a whole catalogue in KRM? I think you could. Static stuff away from PHP and MySQL.

Rough, not measured: 100,000 products × 3 KB ≈ 300 MB. etcd default limit 2 GiB. History and API server memory on top.

[click] Stock and orders: change all the time, transactions. A database.

[click] Search: no full text, joins or sorting. A controller copies it to an index: CQRS.

[click] Not one decision for your shop. The description fits, the stock of that same product doesn't.
-->
