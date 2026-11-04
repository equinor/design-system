// Minimal static file server for the tests: node tests/serve.mjs <dir> <port>
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'

const [root, port = '3200'] = process.argv.slice(2)
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain',
}

createServer(async (request, response) => {
  const path = normalize(
    decodeURIComponent(new URL(request.url, 'http://x').pathname),
  )
  let file = join(root, path)
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html')
    const body = await readFile(file)
    response.writeHead(200, {
      'content-type': types[extname(file)] ?? 'application/octet-stream',
    })
    response.end(body)
  } catch {
    const notFound = await readFile(join(root, '404.html')).catch(
      () => 'Not found',
    )
    response.writeHead(404, { 'content-type': 'text/html' })
    response.end(notFound)
  }
}).listen(Number(port), () =>
  console.log(`serving ${root} on http://localhost:${port}`),
)
