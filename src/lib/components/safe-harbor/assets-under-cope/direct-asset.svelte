<script lang="ts">
    import { GetChain } from "$lib/chains";
    import Address from "$lib/components/address.svelte";
    import ChainIcon from "$lib/components/chain-icon.svelte";
    import type { ChainID } from "$lib/firebase/types/chain";

    interface Props {
        chainID: ChainID;
        address: string;
        name?: string;
        childContractScope: string;
        hasChildren?: boolean;
    }

    let { chainID, address, name, childContractScope, hasChildren }: Props = $props();

    const id = chainID + "-" + address;

    function toggleChildren() {
        const childrenRows = document.querySelectorAll<HTMLElement>(`.child-of-${id}`);
        childrenRows.forEach((row) => {
            row.style.display = row.style.display === "none" ? "" : "none";
        });
    }
</script>

<tr>
    <th scope="row" class="p-3">
        <p>
            {#if hasChildren}
                <button class="btn btn-link p-0" type="button" onclick={() => toggleChildren()}>
                    <span class="down material-symbols-outlined"> keyboard_arrow_down </span>
                </button>
            {/if}
            {#if name && name != ""}
                {name}
            {/if}
        </p>
        <p class="address mt-1">
            <Address {address} {chainID} />
        </p>
    </th>
    <td class="p-3">
        <p class="mb-0">
            {childContractScope}
        </p>
    </td>
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

        button {
            color: var(--text-secondary);
            position: absolute;
            top: 50%;
            left: 0.5rem;
            transform: translateY(-50%);
        }
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
