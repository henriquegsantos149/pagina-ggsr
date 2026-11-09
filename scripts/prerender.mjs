// Prerender estático: renderiza <App /> no build e injeta o HTML em dist/index.html.
// O cliente continua usando createRoot (main.tsx), que substitui esse HTML ao carregar.
import { build } from 'vite'
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const outDir = resolve(root, 'node_modules/.prerender')
const target = resolve(root, 'dist/index.html')
const marker = '<div id="root"></div>'

await build({
  root,
  logLevel: 'warn',
  build: {
    ssr: 'src/entry-server.tsx',
    outDir,
    emptyOutDir: true,
    rollupOptions: { input: 'src/entry-server.tsx' },
  },
})

const { render } = await import(pathToFileURL(resolve(outDir, 'entry-server.js')).href)
const appHtml = render()
const html = readFileSync(target, 'utf8')
if (!html.includes(marker)) throw new Error(`prerender: ${marker} não encontrado em dist/index.html`)
writeFileSync(target, html.replace(marker, () => `<div id="root">${appHtml}</div>`))
rmSync(outDir, { recursive: true, force: true })
console.log(`prerender: ${appHtml.length} caracteres injetados em dist/index.html`)
