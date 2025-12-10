<script lang="ts">
    import { GetChain } from "$lib/chains";
    import type { ChainID } from "$lib/firebase/types/chain";

    interface Props {
        chainID: ChainID;
        lazy?: boolean;
    }

    let { chainID, lazy }: Props = $props();

    const loading: any = lazy !== undefined ? "lazy" : undefined;
    const chain = GetChain(chainID);
</script>

{#if chain}
    <a href={chain.Scan} target="_blank" class="pe-1">
        <img src={chain?.Icon} alt={chain?.Name} width="32" height="32" {loading} />
    </a>
{/if}

<style>
    img {
        border-radius: 100px;
        width: 32px;
        min-width: 32px;
        aspect-ratio: 1;
    }
</style>
