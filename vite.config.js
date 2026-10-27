import { appendFile, mkdir, readFile } from 'node:fs/promises'
import { Buffer } from 'node:buffer'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import en from './src/content/en.js'
import my from './src/content/my.js'
import { site } from './src/content/site.js'
import { acceptNotify } from './src/launch.js'
import { legalPage } from './src/legal-page.js'
import { ROBOTS, siteUrl } from './src/seo.js'

/** Dev-only stand-in for the worker's /api/notify. Signups append to .data/launch-list.ndjson. */
function launchListDev() {
    const file = path.resolve('.data/launch-list.ndjson')
    return {
        name: 'launch-list',
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                const kind = req.url?.split('?')[0].match(/^\/(privacy|terms)\/?$/)?.[1]
                if (!kind) {
                    next()
                    return
                }
                res.statusCode = 200
                res.setHeader('content-type', 'text/html; charset=utf-8')
                res.end(legalPage({ en, my, email: site.supportEmail, robots: ROBOTS, siteUrl, kind }))
            })
            server.middlewares.use('/api/notify', (req, res) => {
                if (req.method !== 'POST') {
                    res.statusCode = 405
                    res.setHeader('content-type', 'application/json')
                    res.end(JSON.stringify({ error: 'method' }))
                    return
                }
                const chunks = []
                let size = 0
                req.on('data', (chunk) => {
                    size += chunk.length
                    if (size <= 4000) chunks.push(chunk)
                })
                req.on('end', async () => {
                    let payload = {}
                    try {
                        payload = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')
                    } catch {
                        payload = {}
                    }
                    const result = await acceptNotify(payload, async (entry) => {
                        await mkdir(path.dirname(file), { recursive: true })
                        const previous = await readFile(file, 'utf8').catch(() => '')
                        const known = previous.split('\n').some((line) => {
                            try {
                                return JSON.parse(line).value === entry.value
                            } catch {
                                return false
                            }
                        })
                        if (!known) await appendFile(file, `${JSON.stringify(entry)}\n`)
                    })
                    res.statusCode = result.status
                    res.setHeader('content-type', 'application/json')
                    res.end(JSON.stringify(result.body))
                })
            })
        },
    }
}

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), launchListDev()],
})
