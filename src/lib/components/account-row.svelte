<!-- <script lang="ts">
    import ChainIcon from "./chain-icon.svelte";
    import { childContractScopeToStr, type Account } from "$lib/safeharbor";
    import Address from "./address.svelte";
    import { GetChainByID } from "../chains";

    interface Props {
        account: Account;
        chainID: number;
        // parent is an optional param passed if this account is a child of another account.
        parent?: Account;
    }

    let { account, chainID, parent }: Props = $props();

    function toggleChildren(id: string) {
        const childrenRows = document.querySelectorAll<HTMLElement>(`.child-of-${id}`);
        childrenRows.forEach((row) => {
            row.style.display = row.style.display === "none" ? "" : "none";
        });
    }
</script>

<tr class={parent ? "child-row child-of-" + parent.address : ""} style={parent ? "display: none;" : ""}>
    <th scope="row" class="p-3">
        <p>
            {#if account.children && account.children.length > 0}
                {account.name}
                <button class="btn btn-link p-0" type="button" onclick={() => toggleChildren(account.address)}>
                    <span class="up material-symbols-outlined" style="display: none;"> keyboard_arrow_up </span>
                    <span class="down material-symbols-outlined"> keyboard_arrow_down </span>
                </button>
            {:else}
                {account.name}
            {/if}
        </p>
        {#if account.name && account.name != ""}
            <p class="address mt-1">
                <Address address={account.address} {chainID} />
            </p>
        {:else}
            <p class="address">
                <Address address={account.address} {chainID} />
            </p>
        {/if}
    </th>
    <td class="p-3">
        {#if account.childContractScope != -1}
            <p class="mb-0">
                {#if typeof account.childContractScope === "string"}
                    {account.childContractScope}
                {:else}
                    {childContractScopeToStr(account.childContractScope)}
                {/if}
            </p>
        {/if}
    </td>
    <td class="p-3">
        <div class="d-flex flex-row align-items-center me-2">
            {#if GetChainByID(chainID)}
                <div class="pe-1">
                    <ChainIcon chain={chainID} lazy />
                </div>
                <p class="ms-2 mb-0 fw-normal">
                    {GetChainByID(chainID).Name}
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
            color: $text-secondary;
            position: absolute;
            top: 50%;
            left: 0.5rem;
            transform: translateY(-50%);
        }
    }

    .child-row th {
        position: relative;
        padding-left: 4rem !important;

        &::before {
            content: "";
            position: absolute;
            top: 0.5rem;
            bottom: 0.5rem;
            left: 3rem;
            width: 1.5px;
            background-color: #dcdfe4;
        }
    }

    tr {
        td,
        th {
            transition: background-color $transition-duration;
        }

        &:hover {
            th,
            td {
                background-color: $bg-secondary;
            }
        }
    }

    p,
    a {
        font-weight: 400;
        margin-bottom: 0;
        white-space: nowrap;
    }
</style> -->
