import { resolve } from '$app/paths';
import type { Protocol } from '$lib/firebase/types/protocol.js';

export async function load({ url, fetch }) {
    const resp = await fetch(resolve("/api/v1/agreements"));
    if (!resp.ok) {
        console.error('API error:', resp.status, await resp.text());
        return { protocols: [] };
    }

    const protocols: Protocol[] = await resp.json();
    return {
        protocols, origin: url.origin
    };
}
