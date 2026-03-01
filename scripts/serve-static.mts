import path from 'path'
import { fileURLToPath } from 'url'
import { createStaticServer } from './static-server.mts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = 3000
const OUT_DIR = path.join(__dirname, '..', 'out')

const server = createStaticServer(OUT_DIR, { spaFallback: true })

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${String(PORT)}/`)
})
