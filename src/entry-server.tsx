import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.tsx'

// Usado apenas no build (scripts/prerender.mjs) para gerar o HTML estático
// da página dentro de #root, para que buscadores e crawlers de IA leiam o
// conteúdo sem executar JavaScript.
export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
