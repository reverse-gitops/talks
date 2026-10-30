# Reality check

Where the talk and the manifesto are most open to "prove it". Every claim on stage needs either evidence or a personal story behind it. Good examples are the best proof that settings *can* be designed well.

## Claims to back up (or soften)

- **"The industry treats settings as a commodity."**
  Don't say this as a general fact unless there's data or concrete examples to back it up. Safer: "In my experience…" plus a story. Strongest: show one good and one bad example side by side.
- **"Settings screens are what nobody is proud of."**
  The same applies. Fine as a personal observation, risky as a claim about everyone. Could become a question to the room: "Who has ever demoed their settings screen?"
- **"Too many settings and users dislike you, too few and they call you Apple."**
  Works as a joke, not as a finding. Keep it light.
- **"The plumbing is rebuilt by every team."**
  Plausible, but have one or two real cases ready, ideally your own.

## Technical limits to say out loud (from the talk)

- etcd is not an application database: objects are capped around 1.5 MB, there are no joins, querying is weak. Fine for control-plane data (settings, menus, flags), not for data-plane data (orders, events, logs).
- Browser → API server: end-user auth (OIDC), CORS and rate limiting all need work. Use a dedicated API server, never the production cluster.
- Someone has to operate it, and someone on the team needs Kubernetes knowledge.
- A lot is still missing; be specific about what you had to build yourself.

## Good examples to collect

People will ask "who does this well?" Collect examples where settings are clearly designed, not just stored. **Candidates, all still to verify and screenshot:**

| Example | What it could show | Manifesto principle |
|---|---|---|
| VS Code settings | UI generated from a JSON schema, raw `settings.json` next to it, user vs workspace scope, search | Schema, deliberate design |
| Firefox Settings vs `about:config` | A small curated layer for users, a raw layer for experts | Every setting has a cost |
| Apple (iOS/macOS) | A good example of restraint: few settings, each one carefully chosen and named | Every setting has a cost |
| Stripe test mode vs live mode | Try configuration safely before it touches real money | Tested first |
| Feature-flag platforms (e.g. LaunchDarkly, Unleash) | Audit logs, approvals, targeting rules, instant rollback | Intent, reversible, not a deploy |
| GitHub branch protection → rulesets | A settings model redesigned as needs grew: concepts evolving over time | Deliberate design |
| Kubernetes itself | Schema, watch, RBAC, conflict detection as a shared standard | Most of them |

**Ask the audience too.** During the talk, ask them on their phones: "Name an app with a really good configuration experience." This gives you real examples instead of only your own picks, and it turns "who does this well?" from a risky claim into a shared finding. Save the answers after every talk (Frontmania, TestNet, …); over time they could become a "hall of fame" on configdeservesbetter.dev.

Also collect **bad examples** (anonymized, or your own past mistakes, which is safest): settings named after implementation details, boolean flags that later needed a third option, settings nobody dares to remove.

## Your own stories

- Being the slow one at naming settings, and why that slowness was actually design work.
- A setting you added and regretted, or one you refused to add and were right about.
  * I hate the negates, the thing that make you thing. DisableRateLimits -> just call it unlimited => limited (true is limited, false not, however not easy)
- Coffee app: decisions you made while designing `CoffeeConfig` (names, allowed combinations, who may change what).
