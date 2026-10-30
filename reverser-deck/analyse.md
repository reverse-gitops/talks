# Reverser deck: analysis

Status on 2026-10-28: pasted from the Claude design tool, nested `.git` removed. No other changes
have been made to the deck or the repo yet.

## TL;DR

- **The nested repo held no useful history.** It was one initial commit (`be4ff85`, made at 12:23 today)
  with no remote, no other branches, no stash, and nothing different from the files on disk. It has
  been deleted. The commit message only said "Seven animated slides imported from the design canvas,
  with a shared slide engine, timeline and controls."
- **Tech:** plain HTML + CSS keyframes, driven by a small JS engine (Web Animations API), built with
  Vite 5. No framework and no runtime dependencies besides two self-hosted fonts.
- **It fits the Slidev framework well.** The engine (`SlideEngine`) is already separate from the
  standalone shell (`Deck`), and only `Deck` touches `window` and `document`. A local Slidev addon in
  `tools/` (the same pattern as the excalidraw and web-terminal addons) can wrap the engine in a Vue
  component that is driven by Slidev clicks.
- **Fix before committing:** the root `.gitignore` ignores `package-lock.json`, and the root `Makefile`
  auto-discovers `*/package.json` and requires a lockfile next to it. In a fresh clone or devcontainer,
  `make install-node-deps` (which `post-create.sh` runs) would fail on `reverser-deck`. See
  [Repo fit](#repo-fit-things-that-break-when-you-commit-it).
- **Timing:** the content matches *settings-that-break* (Dutch Cloud Native Day, **30 October**, two
  days from now). Integrating it into Slidev before then is possible but risky. My advice is to present
  it standalone on Thursday and do the addon afterwards.

## 1. What the deck is built with

| Layer | What | Notes |
| --- | --- | --- |
| Build / dev server | Vite `5.4.21` (pinned) | `base: './'`, so `dist/` works from any sub-path |
| Language | Vanilla ES modules | No TypeScript, no Vue, no React |
| Animation | CSS `@keyframes` on `.an` elements, controlled through `element.getAnimations()` (Web Animations API) | One timeline per slide, duration `--T` |
| Fonts | `@fontsource/space-grotesk`, `@fontsource/jetbrains-mono` | Bundled, so it works offline on stage |
| Origin | Claude design canvas artboards (`*.dc.html`, a `DCLogic` component class) | Converted once by `tools/import_canvas.py` |

### Architecture

```
index.html          #stage + #pager shell
src/main.js         fonts + base.css, new Deck(stage, slides)
src/deck.js         Deck: slide order, keys/mouse, hash, fullscreen, scale-to-window   ← all the globals
src/engine.js       SlideEngine: one slide's timeline as steps, live/freeze, play/scrub ← only touches its root
src/parts/          timeline (bottom bar) + controls (Next / Play buttons)
src/styles/base.css :root tokens, html/body reset, .an primitive, part styles
src/slides/<id>/    slide.html (1600×900 markup), slide.css (keyframes), index.js (seconds, marks, hooks)
```

The step model is the clever part. A slide is one continuous keyframe animation, and `data-steps` on
the root lists the stop points as fractions of it. Pressing *next* plays to the next stop, with each
step capped at 2.5 s by raising the playback rate. Pressing again during a step finishes it at once.
`data-live` lets timers keep ticking while you stand on a stop, and `data-freeze` pauses a loop on one
specific stop. Hooks (`extraState`, `vals`, `vars`, `onFrame`) cover the few slides with counters.

### Content

7 slides: `problem`, `big-picture`, `modeling`, `inside-kcp`, `two-streams`, `commit-request` and
`delivery`. That is about 140 KB of markup and 48 KB of CSS, with 240 animated elements in total.

The markup is design-tool output: absolutely positioned `<div>`s with long inline `style=""`
attributes, and SVG arrows with generated marker ids. Small text edits by hand are fine. Layout
changes are easier to make in the design tool and re-import.

### The importer

`tools/import_canvas.py` reads `<Artboard>.dc.html` files and **overwrites** `src/slides/<id>/*`. The
source `.dc.html` files are **not in the repo**. That means:

- Re-importing is not reproducible from the repo alone.
- Any hand edit to a `slide.html`, `slide.css` or `index.js` is lost on the next import.

If you plan to iterate in the design tool again, store the exported `*.dc.html` files next to the deck
(for example `reverser-deck/canvas/`) and treat the slide folders as generated output. If this was a
one-off, the slide folders are the source and the importer can be deleted.

## 2. Repo fit: things that break when you commit it

1. **Lockfile is git-ignored, and that breaks `make install-node-deps`.** The root `.gitignore` line 1
   is `package-lock.json`. The other lockfiles in the repo were force-added, so they are tracked. The
   Makefile line `NODE_APP_DIRS := ... $(wildcard */package.json)` will pick up `reverser-deck`
   automatically, and its stamp rule has `%/package-lock.json` as a prerequisite. In a fresh clone
   that file is missing, so make fails with *"No rule to make target
   'reverser-deck/package-lock.json'"*. Because `post-create.sh` runs this target, devcontainer
   creation fails too.
   **Fix:** `git add -f reverser-deck/package-lock.json`, or add `!*/package-lock.json` to the root
   `.gitignore`. The second is better, because a lockfile should always be committed.
2. **Two levels of `dist/`.** `reverser-deck/.gitignore` ignores its own `dist/`, which is fine. The
   repo's top-level `dist/` holds the published PDFs. Don't confuse the two.
3. **The import source** (see above).
4. **`settings-that-break` is not a runnable Slidev project yet.** It has a Slidev headmatter but no
   `package.json` and no commits. Whatever "framework" means for that talk, it needs the same scaffold
   as `the-gitops-paradox` (`package.json` with `@slidev/cli`, addons, `vite.config.ts`).

## 3. Making it part of the Slidev framework

### What "the framework" is today (from `the-gitops-paradox`)

- Slidev `^52.14` with `pages/*.md` included through `src:`.
- Local addons in `tools/`, consumed as `file:` dependencies and listed under `addons:` in the
  headmatter: `slidev-addon-excalidraw-renderer` and `slidev-addon-web-terminal`.
- Custom `layouts/` and `components/` per talk.
- A root `Makefile` that installs every `*/package.json`, runs live (`run`) and frozen (`run-frozen`)
  modes, and does a PNG to `img2pdf` PDF export (`export-pdf`).
- The devcontainer, which provides Playwright Chromium for exports.

### Recommended shape: `tools/slidev-addon-animated-slides`

```
tools/slidev-addon-animated-slides/
  package.json              name, "slidev-addon" keyword, deps on the two fontsource packages
  components/AnimatedSlide.vue
  engine/engine.js          ← src/engine.js, unchanged or nearly so
  engine/parts/*.js         ← src/parts/*
  styles/animated.css       ← base.css minus the html/body/:root globals, scoped under .animated-slide
  tools/import_canvas.py    ← importer, extended to scope CSS (see below)

settings-that-break/        (or any talk)
  animated/<id>/slide.html|slide.css|index.js   ← slide content stays with the talk
  pages/…md:
    ---
    clicks: 6
    ---
    <script setup>import bigPicture from '../animated/big-picture/index.js'</script>
    <AnimatedSlide :slide="bigPicture" />
    <!-- speaker notes, which the standalone deck does not have -->
```

The engine and shared parts live in the addon. Slide content lives with the talk. The standalone
`reverser-deck` can then be a thin Vite shell that imports the same engine and the same slide folders,
for a website or the reversegitops.dev version.

### Work needed for the `AnimatedSlide` component

| Topic | Why | How |
| --- | --- | --- |
| **Steps ↔ clicks** | Slidev owns the keyboard and navigation | Set `clicks:` = number of stops (`data-steps` count + 1). Watch `$clicks` from `useSlideContext()`: forward plays to stop *k* (the existing `step(+1)` logic), backward calls `seekAll(stop k)`. Replace `deck.next()/prev()` with no-ops, because Slidev moves to the next slide once the clicks run out. |
| **CSS collisions** | `Deck` shows only one slide's CSS at a time. Slidev keeps several slides in the DOM: neighbours are preloaded, and the presenter view's "next" preview, the overview and export all render more than one. | There are 10+ duplicate `@keyframes` names across slides (`b1`, `c1`, `apiG`, …) and duplicate classes (`.prog`, `.intro`, `.k`, …). Prefix keyframes (`big-picture__b1`) and scope selectors (`[data-slide="big-picture"] .b1`) in the importer or a small PostCSS step. |
| **Duplicate SVG ids** | `dc-arrow-head-filled-1…7` repeat on every slide. With two slides in the DOM, `url(#…)` resolves to the first one in the document, so arrowheads can get the wrong colour. | Prefix ids with the slide id at import time. |
| **Global styles** | `base.css` sets `html, body { overflow: hidden }`, `:root` tokens and `a {}` | Scope everything under the component root. |
| **Scaling** | Slides are 1600×900. Slidev's default canvas is 980 wide. | Wrap the slide in a box with `transform: scale(980/1600)`. Setting `canvasWidth: 1600` globally is an alternative, but it changes the typography of every other slide. |
| **Render context** | Presenter preview, overview and `slidev export` must show a still, deterministic frame | Use `$renderContext`. Only `'slide'` plays the intro, live timers and loops. Every other context calls `seekAll(stop for $clicks)` and pauses loops. With `export --with-clicks`, every step becomes a PNG, which fits the existing `export-pdf` pipeline. |
| **Controls / timeline** | The *Next →* and *Play* buttons are for the web version | Use props: `controls` (default off in Slidev) and `timeline` (default on). The timeline doubles as a progress indicator. |
| **Fonts** | Space Grotesk / JetBrains Mono | Import the fontsource CSS from the addon. This still works offline. |

Effort: roughly a day for the component and CSS/id scoping, plus half a day to check presenter mode
and export. The engine itself barely needs to change.

### Advice for Thursday (30 Oct)

Don't start the addon before the talk. Run `npm run build` once and present from `dist/` (with
`npx vite preview` or `python3 -m http.server`; `file://` does not work because the deck uses ES
modules). Switch between the Slidev tab and the deck tab, or open the deck on a separate screen. The
standalone deck already has fullscreen, keyboard and clicker support (PageDown/PageUp).

## 4. The devcontainer

> **Update 2026-10-28:** fixes 1–6 and tools 1–3 below are done. See `.devcontainer/`, the root
> `.gitignore` (`/package-lock.json`), `make deck-shots` and `reverser-deck/tools/deck-shots.mjs`.

**Verdict: usable as-is for this deck.** `node:24-bookworm` runs Vite 5 fine, and `npm install && npm
run dev` works without changes. It already has the Playwright Chromium system libraries, which is the
main thing I need to check the animated slides visually in headless mode.

### Issues worth fixing

| # | Issue | Impact | Suggestion |
| --- | --- | --- | --- |
| 1 | `post-create.sh` **fails hard** without an SSH agent that has keys loaded | Container creation fails anywhere without agent forwarding (Codespaces, a remote or cloud agent, a new laptop) | Warn and skip commit signing instead of `fail`, or make it opt-in with `REQUIRE_SIGNING=1` |
| 2 | Lockfile ignore + Makefile wildcard (section 2.1) | `make install-node-deps` breaks as soon as `reverser-deck` is committed | Un-ignore lockfiles |
| 3 | Only port 3030 is listed | Vite (5173) and `vite preview` (4173) have no label and depend on auto-forwarding | Add `5173` ("Animated deck") and `4173` to `forwardPorts`/`portsAttributes` |
| 4 | The `talks-demo-repo` mount target hardcodes `/workspaces/talks/...` while `workspaceFolder` uses `${localWorkspaceFolderBasename}` | Breaks if the clone isn't named `talks` | Use `${containerWorkspaceFolder}` in the mount target |
| 5 | `kubectl` (`stable.txt`) and `yq` (`latest`) are unpinned | Rebuilds aren't reproducible | Pin them with `ARG`s, as is already done for k3d and kubectl-neat |
| 6 | `terminal.integrated.shell.linux` | Deprecated VS Code setting | Use `terminal.integrated.defaultProfile.linux` |

### Tools to add so I can work on presentations

In priority order:

1. **A `make deck-shots` target (Playwright script) for the animated deck.** It would open each slide
   and step through it (`deck.show(i)` and `deck.engine.seekAll(stop)` are already exposed on
   `window.deck`), then save one PNG per step. Today I can only judge these slides from markup, and
   with keyframe animations that is guesswork. Run it **only when you ask**, in line with the earlier
   "don't re-render to verify" preference. The Chromium and its libraries are already in the image.
2. **`ffmpeg`** (apt). Use it to record a slide or the whole deck to MP4/GIF as a backup video in
   case the laptop or browser misbehaves on stage, and for sharing on LinkedIn or the website.
   Playwright's `recordVideo` plus ffmpeg is enough. It is installed on your host, but not in the
   image.
3. **`@marp-team/marp-cli` and `@mermaid-js/mermaid-cli`** (global npm). The repo has Marp decks
   (`krm-bff`, `cozystack`) and `.mmd` diagrams (`krm-bff`, `gitops-needs-an-api`), but the container
   can't render either one. Point both at the Playwright Chromium through `CHROME_PATH` and
   `PUPPETEER_EXECUTABLE_PATH` so you don't download a second browser.
4. **Python** is already there (`pip3` is used for `img2pdf`), so `import_canvas.py` runs as-is. No
   change is needed.

I wouldn't add HTML formatters or linters. The slide markup is generated, and reformatting it makes
diffs against a re-import useless.

## 5. Suggested order of work

1. Un-ignore lockfiles, then commit `reverser-deck/` as-is (and the `.dc.html` sources, if you still
   have them).
2. Thursday: present the standalone build.
3. After the talk: devcontainer fixes 1 and 3, plus `ffmpeg` and the `deck-shots` target.
4. Build `tools/slidev-addon-animated-slides`, move the slide folders next to the talk, and make
   `reverser-deck` a thin shell on top of the addon.
