Fix addon self-configuration for out-of-the-box compatibility

Two issues prevented slidev-addon-web-terminal from working when installed by users without extra manual setup:

1. Component not auto-registered (package.json)

The slidev.components field listed a file path ("components/WebTerminal.vue") instead of a directory ("components"). Slidev's addon system expects directory paths — listing a file caused the WebTerminal component to not be registered globally, resulting in a "Failed to resolve component: WebTerminal" error at runtime.

2. xterm CJS modules not pre-bundled (vite.config.ts)

The xterm family of packages (xterm, xterm-addon-attach, etc.) only ship CommonJS builds with no named ESM exports. Vite's dependency scanner doesn't automatically discover them through pnpm's strict node_modules layout, causing a "does not provide an export named 'AttachAddon'" error.

Addons can ship their own vite.config.ts which Slidev merges into the host project's Vite config. Adding optimizeDeps.include there ensures Vite pre-bundles the xterm CJS packages into proper ESM — without users needing to configure anything themselves.

Result: After these two fixes, users only need to add slidev-addon-web-terminal to their addons list and place <WebTerminal> in a slide — nothing else required.