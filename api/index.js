import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { existsSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default async function handler(req, res) {
    const url = new URL(req.url, 'http://localhost');
    let relPath = url.pathname.replace(/^\/api\//, '');

    // If empty, it's just /api
    if (!relPath || relPath === '/') {
        return res.status(200).json({ status: 'API is running' });
    }

    // Try to find the handler in _routes
    // We try: _routes/{relPath}.js and _routes/{relPath}/index.js
    let filePath = join(__dirname, '_routes', relPath + '.js');
    if (!existsSync(filePath)) {
        filePath = join(__dirname, '_routes', relPath, 'index.js');
    }

    if (!existsSync(filePath)) {
        return res.status(404).json({ error: `API route /api/${relPath} not found` });
    }

    try {
        const fileUrl = pathToFileURL(filePath).href;
        const mod = await import(fileUrl);
        const routeHandler = mod.default;

        if (typeof routeHandler !== 'function') {
            return res.status(500).json({ error: `Handler for /api/${relPath} is not a function` });
        }

        return await routeHandler(req, res);
    } catch (err) {
        console.error(`Error in /api/${relPath}:`, err);
        return res.status(500).json({ error: err.message });
    }
}
