<script lang="ts">
    import { GetChain } from "$lib/chains";
    import type { ChainID } from "$lib/firebase/types/chain";
    import Address from "../address.svelte";
    import ChainIcon from "../chain-icon.svelte";

    interface Props {
        chains: Array<{ caip2ChainId: ChainID; assetRecoveryAddress: string }>;
    }

    let { chains }: Props = $props();
</script>

<table class="table">
    <colgroup>
        <col style="width: auto" />
        <col style="width: 200px" />
    </colgroup>
    <thead>
        <tr>
            <th scope="col" class="p-3"><p class="mb-0">Asset Recovery Address</p></th>
            <th scope="col" class="p-3"><p class="mb-0">Chain</p></th>
        </tr>
    </thead>

    <tbody>
        {#each chains as chain}
            <tr>
                <th scope="row" class="p-3">
                    <p class="fw-normal mb-0">
                        <Address address={chain.assetRecoveryAddress} chainID={chain.caip2ChainId} />
                    </p>
                </th>
                <td class="p-3">
                    <div class="d-flex flex-row align-items-center">
                        {#if chain.caip2ChainId && GetChain(chain.caip2ChainId)}
                            <div class="pe-1">
                                <ChainIcon chainID={chain.caip2ChainId} lazy />
                            </div>
                            <p class="ms-2 mb-0 fw-normal">
                                {GetChain(chain.caip2ChainId)?.Name}
                            </p>
                        {:else}
                            <p class="ms-2 mb-0 fw-normal">
                                {chain.caip2ChainId}
                            </p>
                        {/if}
                    </div>
                </td>
            </tr>
        {/each}
    </tbody>
</table>
