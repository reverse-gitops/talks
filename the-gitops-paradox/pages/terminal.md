---
layout: default
---

```
watch --color -n 2 '
  git pull --ff-only --quiet 2>/dev/null
  git log --oneline --graph --decorate --all --color=always | head -30
'
```

<div style="position: absolute; inset: 6px; display: flex; flex-direction: column;">
  <WebTerminal
    backendUrl="http://host.docker.internal:10001"
    sessionId="reverse-gitops-demo-terminal"
    :fontSize="12"
  />
  <div class="clickable-code" style="position: absolute; bottom: 12px; right: 20px; z-index: 10; background: rgba(0,0,0,0.6); padding: 2px 8px; border-radius: 4px; color: #0f0; font-family: monospace;">echo hello</div>
</div>

---
layout: two-cols
layoutClass: gap-6
class: h-full flex flex-col min-h-0  
---

# Left

- Press `t` to focus the terminal
- Press `F2` to release keyboard control back to Slidev
- This slide keeps the same PTY session as the full-screen slide

<div class="clickable-code" style="display: inline-block; margin-top: 1rem; padding: 0.25rem 0.5rem; border-radius: 4px; background: rgba(0,0,0,0.65); color: #0f0; font-family: monospace;">
  kubectl get pods -A
</div>

::right::

<div style="flex: 1; min-height: 0; display: flex; flex-direction: column;">
    <WebTerminal
      backendUrl="http://host.docker.internal:10001"
      sessionId="reverse-gitops-demo-terminal"
      :fontSize="12"
    />
</div>

---
layout: default
---

<div style="position: absolute; inset: 24px; display: flex; flex-direction: column; gap: 16px;">
  <div style="flex: 0 0 calc(50% - 8px);">
    <h1 style="margin: 0 0 0.5rem 0;">Fresh TTY</h1>
    <p style="margin: 0; max-width: 40rem;">
      This slide starts a separate terminal session while keeping room for a title and a few words above it.
    </p>
  </div>

  <div style="flex: 1 1 calc(50% - 8px); min-height: 0;">
    <WebTerminal
      backendUrl="http://host.docker.internal:10001"
      sessionId="reverse-gitops-demo-terminal-lower-half"
      :fontSize="12"
    />
  </div>
</div>
