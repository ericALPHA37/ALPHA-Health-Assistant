import assert from 'node:assert/strict'
import { readFile, access, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'
import { JSDOM } from 'jsdom'

const base = process.env.VITE_BASE_PATH ?? '/ALPHA-Health-Assistant/'
const expectedCsp = [
  "default-src 'none'", "script-src 'self'", "style-src 'self'",
  "img-src 'self'", "font-src 'self'", "connect-src 'none'",
  "object-src 'none'", "base-uri 'none'", "form-action 'none'",
].join('; ')

for (const file of ['index.html', '404.html']) {
  const html = await readFile(join('dist', file), 'utf8')
  const document = new JSDOM(html).window.document
  const policy = document.querySelector('meta[http-equiv="Content-Security-Policy"]')
  assert.equal(policy?.getAttribute('content'), expectedCsp, `${file}: CSP`)
  assert.equal(document.documentElement.lang, 'pt')
  assert.equal(document.querySelector('meta[name="referrer"]')?.content, 'no-referrer')
  assert.ok(!html.includes('%APP_BASE%') && !html.includes('%BASE_URL%'), 'Unresolved base')
  assert.equal(document.querySelectorAll('script:not([src]), style, [style]').length, 0, 'Inline code')

  for (const element of document.querySelectorAll('script[src], link[href]')) {
    assert.ok(policy.compareDocumentPosition(element) & 4, 'CSP must precede resources')
    const url = element.getAttribute('src') ?? element.getAttribute('href')
    assert.ok(url.startsWith(base), `${file}: resource outside base: ${url}`)
    await access(join('dist', url.slice(base.length)))
  }
  if (file === '404.html') assert.equal(document.querySelector('a')?.getAttribute('href'), base)
  else assert.ok(document.querySelector('noscript'), 'Missing JS-disabled fallback')
}

await access('dist/.nojekyll')
let jsBytesGzip = 0
for (const file of await readdir('dist/assets')) {
  assert.ok(!file.endsWith('.map'), 'Public source map')
  if (file.endsWith('.js')) jsBytesGzip += gzipSync(await readFile(join('dist/assets', file))).length
}
// Budget total, não apenas por chunk: evita crescimento silencioso do MVP.
assert.ok(jsBytesGzip > 0 && jsBytesGzip <= 100 * 1024, `JS gzip budget exceeded: ${jsBytesGzip}`)
console.log(`Build verified: base=${base}, CSP, resources, 404, .nojekyll; JS gzip=${jsBytesGzip} bytes (budget 100 KiB).`)
