---
layout: default
transition: fade
---

###### What kube-apiserver already does

# Why build an API? <span class="green">This one is done.</span>

<div class="tiles">
  <div class="tile">
    <h3>Watch</h3>
    <code>GET …/emailsettings?watch=true</code>
    <p>A live stream of every change. Apps, GUIs and Reverser react within milliseconds, no polling.</p>
  </div>
  <div class="tile">
    <h3>RBAC</h3>
    <code>verbs: [get, update] · emailsettings</code>
    <p>Per kind, per namespace, per verb, even per object name. Support may read, admins may write.</p>
  </div>
  <div class="tile">
    <h3>Admission</h3>
    <code>OpenAPI · CEL · webhooks</code>
    <p>Bad config is rejected <em>before</em> it is stored. Defaults are filled in. Your own rules in a policy.</p>
  </div>
  <div class="tile">
    <h3>Audit log</h3>
    <code>user · verb · object · time</code>
    <p>Every request, with the real user on it. This is where Reverser gets the commit author.</p>
  </div>
  <div v-click="1" class="tile">
    <h3>Authentication</h3>
    <code>OIDC · certs · service accounts</code>
    <p>The same login as the rest of your platform. Impersonation for tools that act on your behalf.</p>
  </div>
  <div v-click="1" class="tile">
    <h3>Concurrency</h3>
    <code>resourceVersion → 409 Conflict</code>
    <p>Two people save at once? The second one gets a conflict, not a silent overwrite.</p>
  </div>
  <div v-click="1" class="tile">
    <h3>Discovery</h3>
    <code>kubectl explain emailsettings</code>
    <p>Clients learn the schema at runtime. Forms and docs come from the CRD itself.</p>
  </div>
  <div v-click="1" class="tile">
    <h3>Ecosystem</h3>
    <code>kubectl · client-go · Flux · MCP</code>
    <p>Every tool, library and AI agent that speaks Kubernetes already speaks your API.</p>
  </div>
</div>

<p v-click="2" class="punch">So Git doesn't need to be the database. <strong>kube-apiserver is the API.</strong></p>

<!--
≈1:30 · The famous parts first.

Watch: the app subscribes to its own settings and picks up a change right away. Reverser is just another watcher.
RBAC: fine-grained, per kind, per verb, down to a single object.
Admission: schema plus CEL rules, and webhooks if you need more. Invalid config never lands.
Audit log: every request with the real identity. That's how a commit gets Alice's name on it.

[click] The parts you only notice when you have to build them yourself.
Authentication: OIDC, certs, service accounts. Impersonation for tools acting on behalf of a user.
Concurrency: resourceVersion. Optimistic locking, built in. Git would give you a merge conflict at 3 a.m.
Discovery: the API describes itself, so a GUI can generate a form from the schema.
Ecosystem: kubectl, client libraries in every language, GitOps tools, MCP servers for AI agents.

[click] So I flipped the plan. Git isn't the database; it's the history. The API already exists.
-->

<style>
.tiles { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-top: -8px; }
.tile { display: flex; flex-direction: column; gap: 10px; padding: 18px 20px; background: var(--panel); border: 1px solid var(--line-strong); border-radius: 14px; }
.tile h3 { margin: 0; font-size: 26px; font-weight: 700; color: var(--good); }
.tile code { align-self: flex-start; font-size: 14px !important; white-space: nowrap; }
.tile p { margin: 0; font-size: 18px; line-height: 1.4; color: var(--soft); }
.tile em { font-style: normal; color: var(--text); }
.punch { margin-top: 28px; font-size: 26px; line-height: 1.4; }
.punch em { font-style: normal; color: var(--bad); }
</style>
