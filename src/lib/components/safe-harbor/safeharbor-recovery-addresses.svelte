<script lang="ts">
    import { GetChain, type Chain } from "$lib/chains";
    import type { ChainID } from "$lib/firebase/types/chain";
    import Address from "../address.svelte";
    import ChainIcon from "../chain-icon.svelte";

    interface Props {
        chains: Array<{ id?: ChainID; assetRecoveryAddress: string }>;
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
                        <Address address={chain.assetRecoveryAddress} chainID={chain.id} />
                    </p>
                </th>
                <td class="p-3">
                    <div class="d-flex flex-row align-items-center">
                        {#if chain.id && GetChain(chain.id)}
                            <div class="pe-1">
                                <ChainIcon chainID={chain.id} lazy />
                            </div>
                            <p class="ms-2 mb-0 fw-normal">
                                {GetChain(chain.id)?.Name}
                            </p>
                        {:else}
                            <p class="ms-2 mb-0 fw-normal">
                                {chain.id}
                            </p>
                        {/if}
                    </div>
                </td>
            </tr>
        {/each}
    </tbody>
</table>
