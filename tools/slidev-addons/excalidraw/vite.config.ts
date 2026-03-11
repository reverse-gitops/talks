import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function excalidrawFontsPlugin() {
  let fontsDir: string

  function walkFonts(dir: string, prefix: string, out: Array<{ rel: string; full: string }>) {
    for (const entry of fs.readdirSync(dir)) {
      const full = path.join(dir, entry)
      const rel = `${prefix}/${entry}`
      if (fs.statSync(full).isDirectory()) {
        walkFonts(full, rel, out)
      } else {
        out.push({ rel, full })
      }
    }
  }

  return {
    name: 'excalidraw-fonts',

    buildStart() {
      if (!fontsDir) {
        fontsDir = path.join(__dirname, 'node_modules/@excalidraw/excalidraw/dist/prod/fonts')
        if (!fs.existsSync(fontsDir))
          console.warn(`[excalidraw-fonts] fonts dir not found: ${fontsDir}`)
      }
    },

    configureServer(server: any) {
      fontsDir = path.join(__dirname, 'node_modules/@excalidraw/excalidraw/dist/prod/fonts')
      if (!fs.existsSync(fontsDir))
        console.warn(`[excalidraw-fonts] fonts dir not found: ${fontsDir}`)
      server.middlewares.use('/fonts', (req: any, res: any, next: any) => {
        const filePath = path.join(fontsDir, req.url ?? '')
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          res.setHeader('Content-Type', filePath.endsWith('.woff2') ? 'font/woff2' : 'application/octet-stream')
          res.setHeader('Cache-Control', 'max-age=31536000, immutable')
          res.setHeader('Access-Control-Allow-Origin', '*')
          fs.createReadStream(filePath).pipe(res)
        } else {
          next()
        }
      })
    },

    generateBundle() {
      if (!fontsDir || !fs.existsSync(fontsDir)) return
      const files: Array<{ rel: string; full: string }> = []
      walkFonts(fontsDir, '', files)
      for (const { rel, full } of files) {
        ;(this as any).emitFile({
          type: 'asset',
          fileName: `fonts${rel}`,
          source: fs.readFileSync(full),
        })
      }
    },
  }
}

export default defineConfig({
  plugins: [excalidrawFontsPlugin()],
})
