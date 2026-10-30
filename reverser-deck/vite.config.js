import { defineConfig } from 'vite';

// Relative base so the built deck works from any sub-path (GitHub Pages, a USB stick behind a static server, …).
export default defineConfig({
  base: './',
  // Bind IPv4 loopback: Node resolves localhost to ::1, which VS Code's devcontainer port forward can't reach.
  server: { host: '127.0.0.1' },
  preview: { host: '127.0.0.1' },
  build: { outDir: 'dist', assetsInlineLimit: 0 }
});
