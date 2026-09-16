Swiss Cloud Native Day 2026
GitOps Needs an API

# The short

GitOps works well. Well enough that high-level business intent ends up in Git too: customer tenants, feature rollouts, access policies. The hard part is not storing it there. The hard part is expecting business stakeholders or customers to manage it through pull requests and raw YAML.

Reverse GitOps is an API-first pattern for exactly this problem. A typed Kubernetes API in front of your repo accepts structured intent through CRDs, without giving callers direct access to Git. A controller turns that intent into YAML files and commits them to Git. From there you keep the GitOps workflow you already trust: review, policy checks, CI, and a full audit trail.

I’ll demo this live using the open-source `gitops-reverser` operator, and close with an honest checklist: where this pattern shines (low-churn, high-impact configuration that needs review and audit), and where it is the wrong tool (high-frequency writes, tight latency requirements, or anything that belongs in a normal database).

#

npx @marp-team/marp-cli@latest gitops-needs-an-api.md -o gitops-needs-an-api.html --allow-local-files
# open gitops-needs-an-api.html in a browser, press  p  for presenter view (speaker notes)

npx @mermaid-js/mermaid-cli -i 16-watch-cells.mmd -o 16-watch-cells.svg -b transparent -c mermaid-config.json
npx @mermaid-js/mermaid-cli -i 17-join.mmd -o 17-join.svg -b transparent -c mermaid-config.json
