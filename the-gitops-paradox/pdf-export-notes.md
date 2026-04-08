# PDF Export — The GitOps Paradox

What was done, how it was done, what needed to be installed, and what to fix next.

---

## What was built

The live presentation has the demo woven directly into the slides as live terminals
(`DemoTerminal` components). That setup is great on stage but can't work in a PDF.

The solution was a **frozen PDF mode**: a parallel version of the presentation where
live terminal and voting-demo slides are replaced by static, PDF-safe slides. The
terminal slides use dark-styled code blocks with idealized (but realistic) terminal
output, each with a larger small note:

> ⓘ Rendered output — on stage this was a live terminal

The two modes are selectable via Makefile targets and are kept completely separate — the
live slides are untouched.

---

## Files created or changed

### New files

| File | Purpose |
|---|---|
| `pages-new/1-vote-frozen.md` | PDF-safe version of the voting demo that shows intent as plain editable objects in a Git folder |
| `pages-new/3-3-gitops-frozen.md` | Copy of `3-3-gitops.md` with `DemoTerminal` components replaced by static terminal blocks |
| `slides-pdf.md` | Mirror of `slides.md`, using the frozen voting and GitOps pages instead of the live demo pages |
| `../dist/the-gitops-paradox.pdf` | The generated PDF (29 pages) |

### Modified files

| File | Change |
|---|---|
| `../Makefile` | Added `run-frozen` and `export-pdf` targets; added them to `.PHONY` |
| `../.devcontainer/Dockerfile` | Added Playwright Chromium OS dependencies and `poppler-utils` |
| `../.devcontainer/post-create.sh` | Installs the Playwright Chromium browser after npm dependencies are installed |
| `styles/index.css` | Holds the global slide number badge so it is not embedded in the title slide body |
| `vite.config.ts` | Temporarily added `server: { hmr: { overlay: false } }` during export; **reverted afterwards** |
| `package.json` | `playwright-chromium` added as a dev dependency (required by `slidev export`) |

---

## How it works

### Slide switching

Slidev supports `--entry <file>` to use a different slides root. `slides-pdf.md`
mirrors `slides.md`, but points to frozen pages instead of the live demo pages. No
conditionals, no feature flags, no changes to the live flow.

### Frozen voting slides

The PDF voting demo now emphasizes the main takeaway: intent is not about workloads
yet, and not about the "real" clusters yet. In this demo, intent is just typed,
editable objects in a Git folder:

```
demo-repo/adam/rai/8f/examples.configbutler.ai/v1alpha1/
  quizsessions/vote/demo.yaml
  quizsubmissions/vote/demo-x26lm.yaml
  quizsubmissions/vote/demo-59zd8.yaml
```

The frozen sequence now uses the current checked-out `demo-repo` fixture:
`quizsubmissions/vote/example.yaml`. It shows a `QuizSubmission` object, a rendered
terminal snapshot connecting the API write back to Git commits, and ends with a
**Demo takeaway** slide:

> Not workloads. Just editable intent objects in Git.

### Frozen terminal slides

Each `DemoTerminal` slot is replaced with a `<div>` styled to look like a dark terminal
window. The content is idealized — real commands, plausible but representative output.
A small disclaimer line sits below each block.

**Demo 1** (write intent, watch Git react):
```
$ kubectl apply -f intent.yaml
podinfoapps.kro.run/fiets created
podinfoapps.kro.run/gevel created
podinfoapps.kro.run/paal created

$ watch -n2 "git log --oneline --graph --decorate --all --color"
* 07a6eed (origin/holland-stuff) [CREATE] kro.run/v1alpha1/podinfoapps/paal
* 12f268e [CREATE] kro.run/v1alpha1/podinfoapps/gevel
* 2aeac44 [CREATE] kro.run/v1alpha1/podinfoapps/fiets
* 29e747e (HEAD -> main, origin/main) [UPDATE] v1/namespaces/vote
```

**Demo 2** (merge Holland stuff, watch Kubernetes reconcile):
```
$ merge-holland-stuff.sh
0/5 Ensuring Gitea port-forward
1/5 Fetching origin
2/5 Checking out holland-stuff
3/5 Checking out main
4/5 Merging holland-stuff into main
Done: holland-stuff merged into main and deleted locally and on origin

$ watch -n2 "kubectl get podinfoapps -A"
NAMESPACE         NAME       READY  AGE
podinfos-intent   fiets      True   42s
podinfos-intent   gevel      True   39s
podinfos-intent   paal       True   36s
```

### Makefile targets

```makefile
make run          # live demo — existing target, unchanged
make run-frozen   # start dev server with slides-pdf.md (no btwebterminal needed)
make export-pdf   # export to dist/the-gitops-paradox.pdf
```

### The HMR overlay problem

During export, Vite's hot-reload error overlay was appearing on top of every slide.
The cause: `pages-new/1-vote.md` references a file inside `demo-repo/` which is
normally populated at runtime by `make run-repo-sync` but is empty in a cold environment.

**Workaround applied (temporary):** `server: { hmr: { overlay: false } }` was added to
`vite.config.ts` to suppress the overlay for the export session.

**⚠️ This change was reverted after the export.** The overlay is useful during live dev
and should stay enabled.

**Current fix:** `slides-pdf.md` now uses `pages-new/1-vote-frozen.md`, so the PDF
export no longer depends on the live `1-vote.md` snippet include or on `demo-repo/`
being populated.

If you ever export the live slide root directly, run the `gitops-reverser` container
first. That container populates `demo-repo/` at runtime, which makes the file
reference in `1-vote.md` resolve correctly and eliminates the error entirely.

To start it: `make run-repo-sync` (or `make run` which includes it). Check that
`demo-repo/` is non-empty before exporting the live slide root directly.

---

## Things that needed to be installed

These were not present in the devcontainer and had to be installed manually during the session.

### 1. `playwright-chromium` (npm, project-level)

`slidev export` is powered by Playwright. Without it, the export fails immediately.

```bash
npm install -D playwright-chromium --prefix the-gitops-paradox
```

### 2. Playwright system dependencies (OS-level)

The Playwright-managed Chromium binary (`chrome-headless-shell`) failed with:
```
error while loading shared libraries: libnspr4.so: cannot open shared object file
```

Fixed by running:
```bash
npx playwright install-deps chromium
```

This installed a large set of system libraries including `libnspr4`, `libatk-bridge2.0`,
`libdrm2`, `libgbm1`, `libcups2`, `libgl1-mesa-dri`, `xvfb`, and related font/X11 packages.

### 3. `poppler-utils` (OS-level, for verification only)

Used to inspect and render the generated PDF (`pdfinfo`, `pdftoppm`, `pdftotext`).
Not needed for the export itself — only for checking the output.

```bash
sudo apt-get install -y poppler-utils
```

### 4. Playwright Chromium browser binary (user cache)

After restarting the devcontainer, Playwright itself was installed but the browser
binary cache was empty. `slidev export` failed with:

```
browserType.launch: Executable doesn't exist at /home/node/.cache/ms-playwright/chromium_headless_shell-1217/chrome-headless-shell-linux64/chrome-headless-shell
```

Fixed by running:

```bash
npx playwright install chromium
```

This is now added to `.devcontainer/post-create.sh` so it runs after npm dependencies
are installed.

---

## Completed follow-up: update the devcontainer

**File:** `.devcontainer/Dockerfile`

The devcontainer now installs: `curl`, `ca-certificates`, `httpie`, `sudo`,
Playwright Chromium runtime libraries, `poppler-utils`, `kubectl`, `kubectl-neat`,
`k3d`, `yq`, `httpyac`.

### 1. Playwright system dependencies

The Dockerfile uses the explicit Debian 12 Chromium dependency list from the local
Playwright package. This is more reproducible than running `npx playwright
install-deps chromium` during image build.

### 2. Install `poppler-utils`

Useful for spot-checking PDF output without needing a GUI. This is now included in
the Dockerfile apt package list.

### 3. Add `playwright-chromium` and browser install

`playwright-chromium` is already in `package.json`. The devcontainer
`postCreateCommand` now runs `npx playwright install chromium` after
`make install-node-deps`, so the browser binary cache is populated too.

---

## Open tasks for next session

### 1. Optional: visually spot-check the regenerated PDF

The export now completes, and text extraction confirms the frozen voting slides are
present. A visual `pdftoppm` page check is still useful before publishing.

### 2. Optional: keep `demo-repo/` populated for live dev

The PDF export no longer needs the live voting snippet include, but the live deck still
uses `pages-new/1-vote.md`. For live development or stage rehearsal, run
`make run-repo-sync` or `make run` so `demo-repo/` is populated.

---

## Verification

- `slidev export slides-pdf.md --output ../dist/the-gitops-paradox.pdf` completed successfully
- `pdfinfo` reports **29 pages**
- `pdftotext` confirms the PDF contains "Someone votes", "Demo takeaway", and no leaked `<div>` / `<span>` markup
- `pdftotext` confirms slide numbers are present, and rendered page checks show the page-number badge at bottom-right
- `pdftoppm` page render confirms the `reversegitops.dev` screenshot is visible on page 17
- `pdfinfo -url` confirms page 17 links to `https://reversegitops.dev/`
- File size: **8.6 MB**

Earlier verification rendered the GitOps frozen terminal pages to PNG with `pdftoppm`.
After the voting-slide update, only text/metadata verification was rerun; a final visual
spot-check is still recommended before publishing.
