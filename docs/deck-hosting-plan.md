# Plan: the deck on demo.koudijs.dev

Status: applied on 2026-10-30. All changes are in `external/k8s`, in
`k8s.koudijs.dev/2-gitops/voter-demo/`, which Flux applies: the deck and its route in
`15f85f9`, the Room's picture in `2039f43`. Every check below passed.

## The setup

```
https://demo.koudijs.dev
├── /dcnd-2026/…        NEW   the deck, public       → settings-that-break (nginx)
├── /k8s/ /auth/ …            unchanged, logged in   → krm-foyer → API server, as you
├── /join /bind /logout       unchanged              → Room Pass
└── everything else           unchanged              → Voter
```

- **The deck is public.** It is static files from a public repo, served by nginx from
  `ghcr.io/reverse-gitops/settings-that-break` (public, pulled without a secret).
- **Live data stays guarded.** The seat map and QR code call `/k8s/…` on the same origin.
  krm-foyer only answers those for a logged-in user, as that user: without a session the answer is
  `401`, which the live site gives today.
- **Presenting.** Log in on demo.koudijs.dev first, then open `/dcnd-2026/` in the same browser.
  It is one origin, so the deck's calls carry your session.
- **Room Pass shows the photo** from `/dcnd-2026/images/mission2-simon.jpg`. Room Pass only accepts
  pictures from its own origin, so this works because the deck is on the same domain.

## The changes

1. **New `deck.yaml`**, added to `kustomization.yaml`:
   - A Deployment with 1 replica:
     - image `ghcr.io/reverse-gitops/settings-that-break:sha-0414325@sha256:a1604af4cc66a4253ba0182b69bb61a057139ebf4fa8970e9f834b5a8db21f7c`
     - port 8080, probes on `/healthz`
     - non-root, read-only root filesystem, with an emptyDir at `/tmp` and `/var/cache/nginx`
   - A Service, port 80 → 8080.
   - A NetworkPolicy: ingress from `traefik-system` only.
2. **One new route in `ingress.yaml`:**
   ```yaml
   - match: Host(`demo.koudijs.dev`) && PathPrefix(`/dcnd-2026/`)
     kind: Rule
     priority: 250
     middlewares: [{ name: no-cookie }]
     services: [{ name: settings-that-break, port: 80 }]
   ```
3. **The Room, `room.yaml`**, done last:
   ```yaml
     appearance:
       tagline: Dutch Cloud Native Day · Mission 2
       picture: /dcnd-2026/images/mission2-simon.jpg
       pictureAlt: Simon in Mission 2, before the talk
   ```

## Keeping the risk down

- **Steps 1 and 2 only add things.** No existing object changes. The new route claims a path that
  nothing uses today, which would otherwise fall to Voter's catch-all. Voter, krm-foyer, Room Pass,
  Dex and oauth2-proxy are untouched.
- **The image is pinned by digest**, so a push to `main` during the talk can't change what runs.
- **Commit 1 + 2 together, then check:**
  ```sh
  curl -sI https://demo.koudijs.dev/dcnd-2026/                                 # 200
  curl -sI https://demo.koudijs.dev/dcnd-2026/images/mission2-simon.jpg        # 200, image/jpeg
  curl -sI https://demo.koudijs.dev/dcnd-2026/17                               # 200, not 404
  curl -sI https://demo.koudijs.dev/k8s/apis/examples.configbutler.ai/v1alpha1/namespaces/voter/seats  # still 401
  curl -sI https://demo.koudijs.dev/join                                       # unchanged
  ```
- **Step 3 is the only edit to something live, so it goes in its own commit:**
  - Make it only after the photo URL returns 200; otherwise the join page shows a broken image.
  - Make it **before the doors open**. Any change to the Room starts a new code epoch, and the code
    on screen stops working.
- **Rollback is `git revert`** of either commit. Flux prunes the deck objects, and the route
  disappears with them.

## Notes

- **DNS.** demo.koudijs.dev is a hand-set DNS record pointing at the WAN address `31.201.34.158`.
  The DDNS job doesn't manage it.
- **The room's size already matches.** `seating-plan.yaml` is 10 × 16 with `aisles: [8]`, the same
  as the deck's seat map.
- **The old path is gone from this repo.** `vite.config.ts` and `WEB-TERMINAL.md` said
  `/cnd-utrecht/`; they say `/dcnd-2026/` since `957ae1b`.
