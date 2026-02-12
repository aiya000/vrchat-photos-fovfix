import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = 3000
const OUT_DIR = path.join(__dirname, '..', 'out')

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.txt': 'text/plain',
}

const server = http.createServer((req, res) => {
  let filePath = path.join(OUT_DIR, req.url === '/' ? 'index.html' : req.url ?? '')

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html')
  }

  fs.readFile(filePath, (err, data) => {
    if (err !== null) {
      if (err.code === 'ENOENT') {
        const indexPath = path.join(OUT_DIR, 'index.html')
        fs.readFile(indexPath, (err2, data2) => {
          if (err2 !== null) {
            res.writeHead(404, { 'Content-Type': 'text/plain' })
            res.end('404 Not Found')
            return
          }
          res.writeHead(200, { 'Content-Type': 'text/html' })
          res.end(data2)
        })
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' })
        res.end('500 Internal Server Error')
      }
      return
    }

    const ext = path.extname(filePath)
    const mimeType = MIME_TYPES[ext] ?? 'application/octet-stream'

    res.writeHead(200, { 'Content-Type': mimeType })
    res.end(data)
  })
})

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${String(PORT)}/`)
})
