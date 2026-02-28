// Local API server - runs alongside Vite to handle /api/* requests
// Start with: node api-server.js
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 3001;

// Load .env into process.env
const envPath = join(__dirname, '.env');
if (existsSync(envPath)) {
    const envContent = readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx < 0) return;
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
        }
        process.env[key] = val;
    });
    console.log('[API Server] Loaded .env - SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING');
}

// Dynamically import with cache-busting timestamp
async function getHandler(relPath) {
    const filePath = join(__dirname, 'api', relPath + '.js');
    if (!existsSync(filePath)) return null;
    const fileUrl = pathToFileURL(filePath).href + '?t=' + Date.now();
    const mod = await import(fileUrl);
    return mod.default;
}

const server = createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

    const url = new URL(req.url, `http://localhost:${PORT}`);
    if (!url.pathname.startsWith('/api/')) { res.writeHead(404); res.end('Not found'); return; }

    const relPath = url.pathname.slice(5); // strip /api/
    try {
        const handler = await getHandler(relPath);
        if (!handler) { res.writeHead(404); res.end(JSON.stringify({ error: 'API route not found' })); return; }

        const query = Object.fromEntries(url.searchParams);
        const body = await new Promise(resolve => {
            let d = '';
            req.on('data', c => { d += c; });
            req.on('end', () => { try { resolve(d ? JSON.parse(d) : {}); } catch { resolve({}); } });
        });

        const apiReq = { method: req.method, query, body, headers: req.headers };
        let finished = false;
        const apiRes = {
            statusCode: 200,
            status(c) { this.statusCode = c; return this; },
            setHeader(k, v) { if (!finished) res.setHeader(k, v); return this; },
            json(data) {
                if (finished) return;
                finished = true;
                res.setHeader('Content-Type', 'application/json');
                res.writeHead(this.statusCode);
                res.end(JSON.stringify(data));
            },
            end() {
                if (finished) return;
                finished = true;
                res.writeHead(this.statusCode);
                res.end();
            }
        };
        await handler(apiReq, apiRes);
    } catch (err) {
        console.error(`[API Server] Error in /api/${relPath}:`, err.message);
        if (!res.headersSent) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        }
    }
});

server.listen(PORT, () => console.log(`[API Server] Running on http://localhost:${PORT}`));
