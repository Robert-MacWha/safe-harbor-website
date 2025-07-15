<script lang="ts">
    import { GetChain } from "$lib/chains";
    import type { ChainID } from "$lib/firebase/types/chain";

    interface Props {
        chainID?: ChainID;
        address: string;
    }

    let { chainID, address }: Props = $props();

    const chain = chainID ? GetChain(chainID) : undefined;
    const explorerURL = chain?.AddressScan.replace("{address}", address);
</script>

<a href={explorerURL} target="_blank">
    {address}
</a>

<style>
    a {
        font-family: monospace;
        font-size: 0.9rem;
    }
</style>
