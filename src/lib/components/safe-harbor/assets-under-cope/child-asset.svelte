<script lang="ts">
    import { GetChain } from "$lib/chains";
    import Address from "$lib/components/address.svelte";
    import ChainIcon from "$lib/components/chain-icon.svelte";
    import type { ChainID } from "$lib/firebase/types/chain";

    interface Props {
        chainID: ChainID;
        parentAddress: string;
        address: string;
        name?: string;
    }

    let { chainID, parentAddress, address, name }: Props = $props();

    const parentID = chainID + "-" + parentAddress;
</script>

<tr class={"child-row child-of-" + parentID} style={"display: none;"}>
    <th scope="row" class="p-3">
        <p>
            {#if name && name != ""}
                {name}
            {/if}
        </p>
        <p class="address mt-1">
            <Address {address} {chainID} />
        </p>
    </th>
    <td class="p-3"></td>
    <td class="p-3">
        <div class="d-flex flex-row align-items-center me-2">
            {#if GetChain(chainID)}
                <div class="pe-1">
                    <ChainIcon {chainID} lazy />
                </div>
                <p class="ms-2 mb-0 fw-normal">
                    {GetChain(chainID)?.Name}
                </p>
            {:else if chainID != undefined}
                <p class="ms-2 mb-0 fw-normal">
                    {chainID}
                </p>
            {/if}
        </div>
    </td>
</tr>

<style>
    th {
        position: relative;
        padding-left: 2.5rem !important;
    }

    tr {
        td,
        th {
            transition: background-color var(--transition-duration);
        }

        &:hover {
            th,
            td {
                background-color: var(--bg-secondary);
            }
        }
    }

    p,
    a {
        font-weight: 400;
        margin-bottom: 0;
        white-space: nowrap;
    }
</style>
