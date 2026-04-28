import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const resolveAddonDep = (relativePath: string) => fileURLToPath(new URL(relativePath, import.meta.url))

export default defineConfig({
    resolve: {
        alias: {
            // Slidev merges addon Vite config into the host project. When this addon is linked
            // from a local folder, optimizeDeps runs from the host root and needs explicit paths
            // back to the addon's own xterm dependencies.
            '@xterm/xterm': resolveAddonDep('./node_modules/@xterm/xterm'),
            '@xterm/addon-fit': resolveAddonDep('./node_modules/@xterm/addon-fit'),
            '@xterm/addon-web-links': resolveAddonDep('./node_modules/@xterm/addon-web-links'),
            '@xterm/addon-attach': resolveAddonDep('./node_modules/@xterm/addon-attach'),
        },
    },
    optimizeDeps: {
        include: [
            '@xterm/xterm',
            '@xterm/addon-fit',
            '@xterm/addon-web-links',
            '@xterm/addon-attach',
        ],
    },
})
