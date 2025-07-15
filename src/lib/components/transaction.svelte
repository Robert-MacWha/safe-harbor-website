<script lang="ts">
    import type { Chain } from "$lib/chains";
    import { GetChainByID } from "$lib/chains";

    interface Props {
        txhash: string;
        chain: number;
    }

    let { txhash, chain }: Props = $props();

    let c: Chain | undefined = undefined;
    let isValidChain = false;
    if (chain) {
        c = GetChainByID(chain);
        isValidChain = c != undefined;
    }

    const txPattern = /^0x[a-fA-F0-9]{64}$/;
    let isValidTransaction = txPattern.test(txhash) && isValidChain;

    let explorerURL = c?.TXScan.replace("{tx}", txhash);
</script>

{#if isValidTransaction}
    <a href={explorerURL} target="_blank">
        {txhash}
    </a>
{:else}
    {txhash}
{/if}

<style>
    a {
        font-family: monospace;
    }
</style>
