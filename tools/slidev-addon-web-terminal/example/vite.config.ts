import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
    resolve: {
        dedupe: ['vue'],
        alias: {
            'vue': path.resolve(__dirname, 'node_modules/vue'),
        },
    },
})
