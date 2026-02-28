import { chromium } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import type { AddressInfo } from 'net'
import { createStaticServer } from './static-server.mts'

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
  try {
    await new Promise<void>((resolve, reject) => {
      server.once('error', reject)
      server.listen(0, () => {
        server.removeListener('error', reject)
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
        const response = await page.goto(`${baseUrl}${route}`)
        if (response === null || !response.ok()) {
          const status = response !== null ? response.status() : 'no response'
          throw new Error(`Failed to load ${baseUrl}${route}: status ${String(status)}`)
        }
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
    }
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => {
        if (err !== undefined) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
}

main().catch((err: unknown) => {
  console.error(err)
  process.exit(1)
})
