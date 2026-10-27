import { acceptNotify } from './launch.js';

function json(body, status) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { 'content-type': 'application/json; charset=utf-8' },
    });
}

/** Saves a launch-list signup. Needs the NOTIFY KV binding in wrangler.toml; otherwise the page opens an email. */
async function notify(request, env) {
    if (request.method !== 'POST') return json({ error: 'method' }, 405);
    if (!env.NOTIFY) return json({ error: 'unconfigured' }, 503);

    let payload = {};
    try {
        payload = await request.json();
    } catch {
        payload = {};
    }

    const result = await acceptNotify(payload, async (entry) => {
        const key = `${entry.kind}:${entry.value.toLowerCase()}`;
        if (!(await env.NOTIFY.get(key))) await env.NOTIFY.put(key, JSON.stringify(entry));
    });
    return json(result.body, result.status);
}

export default {
    async fetch(request, env) {
        if (new URL(request.url).pathname === '/api/notify') return notify(request, env);
        return env.ASSETS.fetch(request);
    },
};
