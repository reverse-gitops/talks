# Nerd Font / Starship Setup Notes

## Goal

Add Starship prompt + Nerd Font glyph support to the browser-based xterm.js terminal in Slidev presentations.

---

## What was changed

### 1. `tools/btwebterminal/Dockerfile`

- Installed **Starship** via the official install script (`curl starship.rs/install.sh`)
- Added `eval "$(starship init bash)"` to `/home/node/.bashrc`
- Copied `starship.toml` into `/home/node/.config/starship.toml`

### 2. `tools/btwebterminal/starship.toml` (new file)

Tokyo Night-themed prompt with segments for:
- OS icon (Linux Nerd Font glyph)
- Directory (truncated)
- Git branch + status
- Kubernetes context + namespace
- Command duration (shown after 2s)
- Exit status
- Green/red `❯` character

### 3. `tools/slidev-addon-web-terminal/components/WebTerminal.vue`

#### a. `fontFamily` prop added
```vue
fontFamily?: string
```
Passed to the xterm.js `Terminal` constructor:
```ts
fontFamily: props.fontFamily ?? "'JetBrainsMono Nerd Font Mono', 'JetBrainsMono NF', 'Cascadia Code NF', 'FiraCode Nerd Font Mono', monospace"
```

#### b. `@font-face` rules added to the **non-scoped** `<style>` block
Loads JetBrains Mono Nerd Font Mono from the jsdelivr CDN:
```
https://cdn.jsdelivr.net/gh/ryanoasis/nerd-fonts@v3.4.0/patched-fonts/JetBrainsMono/Ligatures/Regular/JetBrainsMonoNerdFontMono-Regular.ttf
```

**Critical**: must be in `<style>` not `<style scoped>`.
Vue adds `[data-v-xxx]` attribute selectors to scoped rules — `@font-face` has no selector and is silently dropped.

#### c. Font loading race condition fixed
```ts
document.fonts.ready.then(() => {
    if (runId === initRunId) safeFit('fonts-ready')
})
```
Without this, `fit()` runs before the font downloads and calculates wrong `cols`/`rows` using the fallback font's character metrics.

Also changed `font-display: block` (was `swap`) to prevent the browser from briefly measuring with the wrong font.

#### d. Textarea listener memory leak fixed
Previously, the `focus`/`blur` handlers added to `terminal.textarea` were anonymous functions — never cleaned up. Extracted to named component-scope variables and removed in `dispose()`.

---

## Debugging journey

| Attempt | Outcome |
|---|---|
| Initial `@font-face` in separate `assets/nerd-font.css` + JS import | Vite failed to resolve the import path (symlink resolution issue) |
| Moved `@font-face` into `<style scoped>` block | Silently ignored by Vue — scoped styles break `@font-face` |
| Moved `@font-face` into `<style>` (non-scoped) block | **Correct approach** — confirmed via DOM inspection that `fontFamily` is applied |

The DOM inspection confirmed the font family IS being set by xterm:
```
font-family: "JetBrainsMono Nerd Font Mono", "JetBrainsMono NF", ...
```
The CDN URL returns HTTP 200. The remaining question is whether the browser actually downloads and applies the font.

---

## If it still doesn't work

1. **Restart the Slidev dev server** (not just browser refresh) — `<style>` block changes in symlinked packages sometimes don't trigger full HMR reprocessing.

2. **Check the Network tab** in browser DevTools — filter by "Font" or search `JetBrains`. You should see the `.ttf` requests. If they 404, the CDN path changed.

3. **Check the Console** for any font loading errors.

4. **Verify the `<style>` block** was processed — in DevTools, search the page's CSS for `@font-face`. If missing, the style block isn't being included.

5. **Offline fallback** — if the devcontainer has no internet access to jsdelivr, the font will never load. In that case, install the font into the Docker image and serve it locally:
   ```dockerfile
   RUN curl -fsSLo /tmp/JetBrainsMonoNF.ttf \
     "https://cdn.jsdelivr.net/gh/ryanoasis/nerd-fonts@v3.4.0/patched-fonts/JetBrainsMono/Ligatures/Regular/JetBrainsMonoNerdFontMono-Regular.ttf"
   ```
   Then serve via a static route and reference it with a relative URL in the `@font-face`.

---

## No build step needed

The addon is referenced as `file:../tools/slidev-addon-web-terminal` and symlinked into `the-gitops-paradox/node_modules/`. Slidev loads `.vue` files directly — no `npm run build` required. Changes to `.vue` files are picked up by Vite HMR.
