import http from 'http'
import fs from 'fs'
import path from 'path'

export const MIME_TYPES: Record<string, string> = {
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

export interface StaticServerOptions {
  spaFallback?: boolean
}

export function createStaticServer(outDir: string, options: StaticServerOptions = {}): http.Server {
  const { spaFallback = false } = options
  const resolvedOutDir = path.resolve(outDir)

  return http.createServer(async (req, res) => {
    const rawUrl = req.url ?? '/'
    const pathOnly = rawUrl.split(/[?#]/)[0] ?? '/'

    let decodedPath: string
    try {
      decodedPath = decodeURIComponent(pathOnly)
    } catch {
      res.writeHead(400, { 'Content-Type': 'text/plain' })
      res.end('400 Bad Request')
      return
    }

    let normalizedPath = path.normalize(decodedPath)

    if (normalizedPath === '/' || normalizedPath === '.') {
      normalizedPath = 'index.html'
    } else {
      normalizedPath = normalizedPath.replace(/^[/\\]+/, '')
    }

    let filePath = path.resolve(resolvedOutDir, normalizedPath)

    const relativePath = path.relative(resolvedOutDir, filePath)
    if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' })
      res.end('403 Forbidden')
      return
    }

    try {
      if (!path.extname(filePath) && fs.existsSync(filePath + '.html')) {
        filePath = filePath + '.html'
      } else if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html')
      }
    } catch {
      // statSync failed (e.g. TOCTOU race); fall through to readFile below
    }

    try {
      const data = await fs.promises.readFile(filePath)
      const ext = path.extname(filePath)
      const mimeType = MIME_TYPES[ext] ?? 'application/octet-stream'
      res.writeHead(200, { 'Content-Type': mimeType })
      res.end(data)
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code
      if (code !== 'ENOENT') {
        res.writeHead(500, { 'Content-Type': 'text/plain' })
        res.end('500 Internal Server Error')
        return
      }
      if (spaFallback) {
        const indexPath = path.join(resolvedOutDir, 'index.html')
        try {
          const indexData = await fs.promises.readFile(indexPath)
          res.writeHead(200, { 'Content-Type': 'text/html' })
          res.end(indexData)
        } catch (indexError) {
          const indexCode = (indexError as NodeJS.ErrnoException).code
          if (indexCode !== 'ENOENT') {
            res.writeHead(500, { 'Content-Type': 'text/plain' })
            res.end('500 Internal Server Error')
          } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' })
            res.end('404 Not Found')
          }
        }
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' })
        res.end('404 Not Found')
      }
    }
  })
}
