import { defineConfig } from 'vite'

export default defineConfig({
    optimizeDeps: {
        include: [
            '@xterm/xterm',
            '@xterm/addon-fit',
            '@xterm/addon-web-links',
            '@xterm/addon-attach',
        ],
    },
})
