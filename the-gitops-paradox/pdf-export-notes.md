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
| `pages/1-vote-frozen.md` | PDF-safe version of the voting demo that shows intent as plain editable objects in a Git folder |
| `pages/3-3-gitops-frozen.md` | Copy of `3-3-gitops.md` with `DemoTerminal` components replaced by static terminal blocks |
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
* 07a6eed (origin/nl-stuff) [CREATE] kro.run/v1alpha1/podinfoapps/paal
* 12f268e [CREATE] kro.run/v1alpha1/podinfoapps/gevel
* 2aeac44 [CREATE] kro.run/v1alpha1/podinfoapps/fiets
* 29e747e (HEAD -> main, origin/main) [UPDATE] v1/namespaces/vote
```

**Demo 2** (merge Holland stuff, watch Kubernetes reconcile):
```
$ merge-nl-stuff.sh
0/5 Ensuring Gitea port-forward
1/5 Fetching origin
2/5 Checking out nl-stuff
3/5 Checking out main
4/5 Merging nl-stuff into main
Done: nl-stuff merged into main and deleted locally and on origin

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
The cause: `pages/1-vote.md` references a file inside `demo-repo/` which is
normally populated at runtime by `make run-repo-sync` but is empty in a cold environment.

**Workaround applied (temporary):** `server: { hmr: { overlay: false } }` was added to
`vite.config.ts` to suppress the overlay for the export session.

**⚠️ This change was reverted after the export.** The overlay is useful during live dev
and should stay enabled.

**Current fix:** `slides-pdf.md` now uses `pages/1-vote-frozen.md`, so the PDF
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

### 1. Optional: keep `demo-repo/` populated for live dev

The PDF export no longer needs the live voting snippet include, but the live deck still
uses `pages/1-vote.md`. For live development or stage rehearsal, run
`make run-repo-sync` or `make run` so `demo-repo/` is populated.

---

## Known issue: pink/warm color shift in direct PDF export

### Symptom

Running `slidev export --format pdf` directly produces a PDF where the cover slide
background looks pinkish/warm-tinted instead of matching the live browser presentation.
The `linear-gradient(#0005, #0008)` overlay that darkens the cover image correctly on
screen appears to shift warm in the PDF.

### Root cause

`page.pdf()` in Playwright always renders through Chromium's **PDFium** renderer, which
applies its own color space transformations. Compositing a semi-transparent CSS gradient
over a JPEG in PDFium's pipeline produces color shift artifacts — even though the colors
are correct in a browser screenshot.

This is not a missing `emulateMedia('screen')` call: Slidev's export code already calls
`page.emulateMedia({ media: "screen" })` before `page.pdf()`. That only affects which
CSS rules apply; it does not change PDFium's color pipeline.

The `--force-color-profile=srgb` Chrome flag that would override PDFium's color handling
was removed in Chrome 84. There is no CSS property or remaining flag that reliably
prevents this. `print-color-adjust: exact` (already set by Slidev) only prevents ink
saving adjustments, not the color space conversion.

There is no single upstream fix for this; it is a fundamental property of how Chromium's PDFium renderer handles color.

### Best quality: browser print-to-PDF (manual)

Start the frozen dev server, open the export page in a regular browser, and use the
OS print dialog (⌘P → Save as PDF on macOS). This goes through the OS PDF renderer
rather than PDFium and produces correct colors at ~8.7 MB — identical to what the live
presentation looks like on screen.

```bash
make run-frozen
# then open http://localhost:<port>/export in Chrome and print to PDF
```

This cannot be automated from inside a devcontainer because it requires an interactive
browser with the OS print dialog.

### Automated fallback: PNG-to-PDF pipeline

`make export-pdf` exports slides as PNGs first (screen rendering mode, correct
colors), then combines them into a PDF with `img2pdf`:

```makefile
export-pdf: install-node-deps
    rm -rf /tmp/slidev-export-png && mkdir -p /tmp/slidev-export-png
    cd the-gitops-paradox && npx slidev export slides-pdf.md --format png \
        --output /tmp/slidev-export-png --scale 2 --timeout 60000
    ls -v /tmp/slidev-export-png/*.png | xargs /home/node/.local/bin/img2pdf \
        -o dist/the-gitops-paradox.pdf
```

`img2pdf` embeds the PNGs losslessly without re-encoding, so colors are exactly as
rendered on screen. The `ls -v` sorts filenames numerically (1, 2, 3 … 29) rather than
lexicographically (1, 10, 11 … 2), which matters once slide count exceeds 9.

**Tradeoff:** pages are rasterized (no text layer for search/copy). File size is larger:
~21 MB vs ~8.7 MB for the browser print method. For a shared presentation deck this is
acceptable; for the highest quality export use the browser print method above.

### Installation note

`img2pdf` is a Python package not present by default. Install it once with:

```bash
pip3 install --break-system-packages img2pdf
```

It installs to `/home/node/.local/bin/img2pdf`. This is added to
`.devcontainer/post-create.sh` so it survives container rebuilds.

---

## Verification

- PNG export: `✓ exported to ../../../tmp/slidev-export-png` (29 files)
- `pdfinfo` reports **29 pages**, page size **1470 × 828 pts**
- File size: **21 MB**
- Visual check of page 1 PNG confirms correct teal/blue-green wall colors matching the live presentation
