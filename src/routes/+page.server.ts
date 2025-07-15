import type { Protocol } from '$lib/firebase/types/protocol.js';

type Chain = {
    name: string;
    tvl: number;
};

export async function load({ fetch }) {
    const agreementsResp = await fetch("/api/v1/agreements");
    const protocols: Protocol[] = await agreementsResp.json();

    const tvlResp = await fetch("https://api.llama.fi/v2/chains");
    const chains: Chain[] = await tvlResp.json();
    const tvlSum = chains.reduce((acc, chain) => acc + chain.tvl, 0);

    return { protocols: protocols, tvl: tvlSum };
}
