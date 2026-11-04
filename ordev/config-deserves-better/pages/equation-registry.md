---
transition: fade
clicks: 2
---

# Production behaviour

<div class="stage">
  <ProductionEquation compact>
    <template #code>
      <div class="steps">
        <div class="step">
          <div class="what">Git</div>
          <div class="chips"><b>GitHub</b><b>GitLab</b><b>Bitbucket</b><b>Azure Repos</b></div>
        </div>
        <div class="step">
          <div class="what">CI</div>
          <div class="chips"><b>GitHub Actions</b><b>GitLab CI</b><b>Jenkins</b></div>
        </div>
      </div>
    </template>
    <template #config>
      <div class="middle">
        <div class="poor">
          <div class="small">a database table</div>
          <div class="tiny-table">
            <span>settings</span>
            <i /><i /><i />
          </div>
          <div class="tiny-products">PostgreSQL · SQL Server</div>
        </div>
        <div class="registry fade" :class="{ off: $clicks < 1, lit: $clicks >= 2 }">
          <div class="what">Container registry</div>
          <div class="chips"><b>Docker Hub</b><b>GHCR</b><b>ACR</b><b>ECR</b><b>Harbor</b><b>zot</b></div>
          <div class="any fade" :class="{ off: $clicks < 2 }">
            <strong>Stores artifacts of any kind</strong>
            <span>containers · Helm charts · SBOMs · …</span>
          </div>
        </div>
      </div>
    </template>
    <template #infra>
      <div class="steps">
        <div class="step">
          <div class="what">GitOps</div>
          <div class="products">
            <span class="kicker">DELIVERY</span>
            <div class="chips"><b>Argo CD</b><b>Flux</b></div>
            <span class="kicker">PROVISIONING</span>
            <div class="chips"><b>Terraform</b><b>OpenTofu</b><b>Crossplane</b></div>
          </div>
        </div>
        <div class="step">
          <div class="what">CD</div>
          <div class="chips"><b>Octopus Deploy</b><b>Azure Pipelines</b><b>Harness</b></div>
        </div>
      </div>
    </template>
  </ProductionEquation>

  <Arrow points="288,522 288,536" />
  <Arrow class="fade" :class="{ off: $clicks < 1 }" points="512,672 572,672" />
  <Arrow class="fade" :class="{ off: $clicks < 1 }" points="1024,672 1084,672" />
</div>

<!--
Back to the equation, and what each part gets from us. Code gets Git and CI. Deploying is really the infra side: that is CD, next to GitOps. And config, the one that just took everything down? A database table. This big.

[click] And between the two sits one more place: the container registry. CI pushes to it, CD takes from it. What you deploy is a versioned thing that sits there.

[click] And here's the point: that's an extra place where you can store artifacts of any kind. Not just containers. It is sitting right there, right below our configuration.
-->

<style>
.steps, .middle { display: grid; grid-template-rows: repeat(2, 265px); row-gap: 18px; margin-top: 4px; }
.step, .registry { box-sizing: border-box; background: var(--panel); border: 1px solid var(--line-strong); border-radius: 14px; }
.step { padding: 14px 22px; }
.what { font-size: 30px; line-height: 38px; font-weight: 700; margin-bottom: 10px; }
.chips { display: flex; flex-wrap: wrap; gap: 8px; }
.chips b { padding: 5px 12px; background: var(--panel-deep); border: 1px solid var(--line-strong); border-radius: 9px; font-size: 20px; line-height: 26px; font-weight: 500; }

.products { display: flex; flex-direction: column; gap: 8px; }
.products .chips + .kicker { margin-top: 10px; }

/* Next to its neighbours, config has almost nothing; the registry sits below it. */
.poor {
  box-sizing: border-box; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;
  border: 2px dashed var(--line-strong); border-radius: 14px;
}
.small { font-size: 15px; line-height: 20px; font-weight: 500; color: var(--soft); }
.tiny-table {
  width: 96px; overflow: hidden; background: var(--panel-deep); border: 1px solid var(--bad); border-radius: 5px;
  font-family: var(--mono); font-size: 11px; line-height: 16px; color: var(--bad); text-align: center;
}
.tiny-table span { display: block; border-bottom: 1px solid var(--bad); }
.tiny-table i { display: block; height: 7px; border-bottom: 1px solid var(--line); }
.tiny-table i:last-child { border-bottom: 0; }
.tiny-products { font-family: var(--mono); font-size: 11px; line-height: 16px; color: var(--muted); }

.registry { padding: 16px 22px; transition: opacity .5s ease, border-color .4s, box-shadow .4s; }
.registry.lit { border-color: var(--accent); box-shadow: 0 0 32px rgba(90, 184, 255, .25); }
.any { display: flex; flex-direction: column; gap: 4px; margin-top: 14px; font-size: 26px; line-height: 34px; }
.any strong { color: var(--accent); font-weight: 700; }
.any span { font-family: var(--mono); font-size: 16px; line-height: 24px; color: var(--soft); }
</style>
