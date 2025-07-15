import type { Protocol } from '$lib/firebase/types/protocol.js';

export async function load({ fetch }) {
    const agreementsResp = await fetch("/api/v1/agreements");
    const protocols: Protocol[] = await agreementsResp.json();

    return { protocols: protocols };
}
