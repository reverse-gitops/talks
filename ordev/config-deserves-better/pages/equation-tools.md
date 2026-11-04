---
transition: fade
clicks: 3
---

# Production behaviour

<div class="stage">
  <ProductionEquation compact>
    <template #code>
      <div class="column fade" :class="{ off: $clicks < 1 }">
        <div class="what">Git and CI/CD</div>
        <div class="products">
          <span class="kicker">GIT</span>
          <div class="chips"><b>GitHub</b><b>GitLab</b><b>Bitbucket</b><b>Azure Repos</b></div>
          <span class="kicker">CI/CD</span>
          <div class="chips"><b>GitHub Actions</b><b>GitLab CI</b><b>Azure Pipelines</b><b>Jenkins</b></div>
        </div>
      </div>
    </template>
    <template #config>
      <div class="column poor fade" :class="{ off: $clicks < 3 }">
        <div class="what small">a database table</div>
        <div class="tiny-table">
          <span>settings</span>
          <i /><i /><i />
        </div>
        <div class="tiny-products">PostgreSQL · SQL Server</div>
      </div>
    </template>
    <template #infra>
      <div class="column fade" :class="{ off: $clicks < 2 }">
        <div class="what">GitOps</div>
        <div class="products">
          <span class="kicker">DELIVERY</span>
          <div class="chips"><b>Argo CD</b><b>Flux</b></div>
          <span class="kicker">PROVISIONING</span>
          <div class="chips"><b>Terraform</b><b>OpenTofu</b><b>Crossplane</b></div>
        </div>
      </div>
    </template>
  </ProductionEquation>
</div>

<!--
Same equation, after what we just saw. So why is that middle one so easy to break?
Look at what each part gets from us.

[click] Code gets Git and CI/CD. Every change has a name, a review and a pipeline, and you can pick from a whole shelf of products.

[click] Infra used to be the wild west, too. Now it gets GitOps: declared, reviewed, reconciled, and you can go back.

[click] And config, the one that just took everything down? It gets a database table. This big.

That is not a dig at databases: for your orders it is exactly right. And some apps get settings right. But why is this the default?
-->

<style>
.column {
  box-sizing: border-box; height: 100%; min-height: 470px; padding: 22px 24px;
  background: var(--panel); border: 1px solid var(--line-strong); border-radius: 14px;
}
.what { font-size: 32px; line-height: 40px; font-weight: 700; padding-bottom: 16px; border-bottom: 1px solid var(--line-strong); }
.products { display: flex; flex-direction: column; gap: 10px; margin-top: 20px; }
.products .chips + .kicker { margin-top: 16px; }
.chips { display: flex; flex-wrap: wrap; gap: 10px; }
.chips b { padding: 7px 14px; background: var(--panel-deep); border: 1px solid var(--line-strong); border-radius: 9px; font-size: 21px; line-height: 28px; font-weight: 500; }

/* The point of the slide: next to its neighbours, config has almost nothing. */
.poor {
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;
  background: none; border: 2px dashed var(--line-strong);
}
.what.small { font-size: 15px; line-height: 20px; font-weight: 500; padding: 0; border: 0; color: var(--soft); }
.tiny-table {
  width: 96px; overflow: hidden; background: var(--panel-deep); border: 1px solid var(--bad); border-radius: 5px;
  font-family: var(--mono); font-size: 11px; line-height: 16px; color: var(--bad); text-align: center;
}
.tiny-table span { display: block; border-bottom: 1px solid var(--bad); }
.tiny-table i { display: block; height: 7px; border-bottom: 1px solid var(--line); }
.tiny-table i:last-child { border-bottom: 0; }
.tiny-products { font-family: var(--mono); font-size: 11px; line-height: 16px; color: var(--muted); }
</style>
