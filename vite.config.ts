import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// Meta CSP não suporta frame-ancestors. Num alojamento com headers,
// definir também frame-ancestors 'none' por HTTP (ver docs/SECURITY.md).
function securityPlugin(base: string): Plugin {
  let notFoundPath = resolve('dist/404.html')
  const csp = [
    "default-src 'none'",
    "script-src 'self'",
    "style-src 'self'",
    "img-src 'self'",
    "font-src 'self'",
    "connect-src 'none'",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'none'",
  ].join('; ')

  return {
    name: 'production-security',
    apply: 'build',
    configResolved(config) {
      notFoundPath = resolve(config.root, config.build.outDir, '404.html')
    },
    transformIndexHtml: {
      order: 'post',
      handler: () => [{
        tag: 'meta',
        attrs: { 'http-equiv': 'Content-Security-Policy', content: csp },
        // A política tem de preceder todos os recursos que protege.
        injectTo: 'head-prepend',
      }],
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: '.nojekyll', source: '' })
    },
    // O 404 é um documento independente: sem JS nem CSS inline.
    // Usa o mesmo base configurável que a aplicação principal.
    closeBundle: async () => {
      const { readFile, writeFile } = await import('node:fs/promises')
      const html = await readFile(notFoundPath, 'utf8')
      await writeFile(notFoundPath, html
        .replaceAll('%APP_BASE%', base)
        .replace('<!-- CSP -->', `<meta http-equiv="Content-Security-Policy" content="${csp}" />`))
    },
  }
}

const base = process.env.VITE_BASE_PATH ?? '/ALPHA-Health-Assistant/'
if (!/^\/(?:[A-Za-z0-9_-]+\/)*$/.test(base)) {
  throw new Error('VITE_BASE_PATH deve ser / ou um caminho como /ALPHA-Health-Assistant/.')
}

export default defineConfig({
  plugins: [react(), securityPlugin(base)],
  base,
  server: { host: '0.0.0.0' },
  preview: { host: '0.0.0.0' },
})
