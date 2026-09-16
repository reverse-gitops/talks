# Audit webhook with mutual TLS

> 📄 **Mirrors the live deployment.** The config below is taken from the
> infra-cozystack Talos source of truth
> (`infra-cozystack/talos/talm/`). Certificate/key blobs are truncated or
> redacted here — the real private key lives only in the cluster config, never
> in this doc.

Mutual TLS here means **two** checks, not one:

- the **apiserver verifies the webhook server's cert** → you're talking to the real reverser, and
- the **reverser verifies the apiserver's client cert** → the audit events are provably
  from the real apiserver.

That second check is the one that lets you **trust the human names on commits**. Without
it, anything that can reach the webhook endpoint could forge audit events and put fake
names in your history.

---

## 1. Audit webhook kubeconfig

`files/audit-webhook.yaml` — mounted at `/var/audit-webhook.yaml`, the kubeconfig the apiserver uses to call the webhook:

```yaml
apiVersion: v1
kind: Config
preferences: {}
clusters:
- name: audit-webhook
  cluster:
    server: https://192.168.20.31:9444/audit-webhook
    # CA that signed the reverser's SERVER cert → apiserver trusts the endpoint
    certificate-authority-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0t...  # (truncated)
    # SNI: the reverser presents a cert for this name even though we dial an IP
    tls-server-name: gitops-reverser-audit.gitops-reverser.svc
contexts:
- name: webhook
  context:
    cluster: audit-webhook
    user: kube-apiserver
current-context: webhook
users:
- name: kube-apiserver
  user:
    # Client cert the apiserver PRESENTS → reverser verifies it = mutual TLS
    client-certificate-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0t...  # (truncated)
    client-key-data: <REDACTED — private key, lives only in the cluster>
```

## 2. kube-apiserver flags

Wired through Talos as `cluster.apiServer.extraArgs` (see `templates/_helpers.tpl`):

```yaml
apiServer:
  extraArgs:
    audit-policy-file: /var/audit-policy.yaml
    audit-webhook-config-file: /var/audit-webhook.yaml
    audit-webhook-batch-max-wait: 1s
    audit-webhook-batch-max-size: "100"
```

(The policy and webhook files are mounted via `extraVolumes` as read-only host paths.)
On Cozystack the distro owns the apiserver, so these can be wired **for** the user — the
single hardest install step everywhere else disappears.

## 3. Audit policy

`files/audit-policy.yaml` — mounted at `/var/audit-policy.yaml`:

```yaml
apiVersion: audit.k8s.io/v1
kind: Policy
omitStages:
  - "RequestReceived"
rules:
  # Drop the noisy / high-volume resources entirely
  - level: None
    resources:
    - group: ""
      resources: ["events", "endpoints", "nodes", "pods", "secrets", "bindings", "componentstatuses", "*/status"]
    - group: "authentication.k8s.io"
      resources: ["tokenreviews"]
    - group: "authorization.k8s.io"
      resources: ["subjectaccessreviews", "selfsubjectaccessreviews", "localsubjectaccessreviews", "selfsubjectrulesreviews"]
    - group: "coordination.k8s.io"
      resources: ["leases"]
    - group: "apps"
      resources: ["*/status"]
    - group: "networking.k8s.io"
      resources: ["*/status"]
  - level: None
    users: ["system:serviceaccount:kube-system:horizontal-pod-autoscaler"]
    verbs: ["update", "patch"]
    resources:
    - group: "apps"
      resources: ["*/scale"]
  # Everything else that mutates: full request + response bodies
  - level: RequestResponse
    omitManagedFields: true
    verbs:
    - create
    - update
    - patch
    - delete
    - deletecollection
```

## 4. Reverser side

The reverser terminates TLS with its **server cert** and is configured to **require and
verify** the apiserver **client cert** against the apiserver client CA. Only verified
audit facts are allowed to attach a human name to a commit; anything unverified falls
back to bot attribution (with the reason recorded).
