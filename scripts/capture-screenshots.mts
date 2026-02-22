import { chromium } from '@playwright/test'
import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import type { AddressInfo } from 'net'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function parseArgs(): { outDir: string; outputDir: string } {
  const args = process.argv.slice(2)
  let outDir = path.resolve(__dirname, '..', 'out')
  let outputDir = path.resolve('screenshots')

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    const nextArg = args[i + 1]
    if (arg === '--out-dir' && nextArg !== undefined) {
      outDir = path.resolve(nextArg)
      i++
    } else if (arg === '--output-dir' && nextArg !== undefined) {
      outputDir = path.resolve(nextArg)
      i++
    }
  }

  return { outDir, outputDir }
}

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

function createStaticServer(outDir: string): http.Server {
  return http.createServer(async (req, res) => {
    const rawUrl = req.url ?? '/'
    const pathOnly = rawUrl.split(/[?#]/)[0] ?? '/'

    let decodedPath: string
    try {
      decodedPath = decodeURIComponent(pathOnly)
    } catch {
      res.writeHead(400)
      res.end('Bad Request')
      return
    }

    let normalizedPath = path.normalize(decodedPath)

    if (normalizedPath === '/' || normalizedPath === '.') {
      normalizedPath = 'index.html'
    } else {
      normalizedPath = normalizedPath.replace(/^[/\\]+/, '')
    }

    let filePath = path.resolve(outDir, normalizedPath)
    const resolvedOutDir = path.resolve(outDir)

    const relativePath = path.relative(resolvedOutDir, filePath)
    if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
      res.writeHead(403)
      res.end('Forbidden')
      return
    }

    if (!path.extname(filePath) && fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html'
    } else if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html')
    }

    try {
      const data = await fs.promises.readFile(filePath)
      const ext = path.extname(filePath)
      const mimeType = MIME_TYPES[ext] ?? 'application/octet-stream'
      res.writeHead(200, { 'Content-Type': mimeType })
      res.end(data)
    } catch {
      res.writeHead(404)
      res.end('Not Found')
    }
  })
}

const PAGES: Array<{ name: string; route: string }> = [
  { name: 'home', route: '/' },
  { name: 'oss', route: '/oss' },
]

async function main(): Promise<void> {
  const { outDir, outputDir } = parseArgs()

  if (!fs.existsSync(outDir)) {
    console.error(`out directory does not exist: ${outDir}`)
    process.exit(1)
  }

  fs.mkdirSync(outputDir, { recursive: true })

  const server = createStaticServer(outDir)
  await new Promise<void>((resolve) => {
    server.listen(0, () => {
      resolve()
    })
  })

  const address = server.address() as AddressInfo
  const baseUrl = `http://localhost:${String(address.port)}`
  console.log(`Server started at ${baseUrl}`)

  const browser = await chromium.launch()
  try {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
    })
    const page = await context.newPage()

    for (const { name, route } of PAGES) {
      await page.goto(`${baseUrl}${route}`)
      await page.waitForLoadState('networkidle')
      await page.screenshot({
        path: path.join(outputDir, `${name}.png`),
        fullPage: true,
      })
      console.log(`Captured: ${name}`)
    }

    await context.close()
  } finally {
    await browser.close()
    await new Promise<void>((resolve) => {
      server.close(() => {
        resolve()
      })
    })
  }
}

main().catch((err: unknown) => {
  console.error(err)
  process.exit(1)
})
