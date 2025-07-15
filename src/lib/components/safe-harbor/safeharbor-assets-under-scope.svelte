<script lang="ts">
    import type { SafeHarborAgreement } from "$lib/firebase/types/safeHarborAgreement";
    import AccountRow from "../account-row.svelte";
    import ChildAsset from "./assets-under-cope/child-asset.svelte";
    import DirectAsset from "./assets-under-cope/direct-asset.svelte";

    interface Props {
        agreement: SafeHarborAgreement;
    }

    let { agreement }: Props = $props();
</script>

<table class="table">
    <colgroup>
        <col style="width: auto" />
        <col style="width: 300px" />
    </colgroup>
    <thead>
        <tr>
            <th scope="col" class="p-3"><p class="mb-0">Asset</p></th>
            <th scope="col" class="p-3"><p class="mb-0">Child Scope</p></th>
            <th scope="col" class="p-3"><p class="mb-0">Chain</p></th>
        </tr>
    </thead>
    <tbody>
        {#if agreement.version === "seal-1"}
            {#each agreement.agreementDetails.chains as chain}
                {#if chain.accounts}
                    {#each chain.accounts as account}
                        <DirectAsset
                            chainID={chain.id}
                            address={account.address}
                            name={account.name}
                            childContractScope={account.childContractScope}
                            hasChildren={account.children && account.children.length > 0}
                        />
                        {#if account.children}
                            {#each account.children as child}
                                <ChildAsset
                                    chainID={chain.id}
                                    parentAddress={account.address}
                                    address={child.address}
                                    name={child.name}
                                />
                            {/each}
                        {/if}
                    {/each}
                {/if}
            {/each}
        {:else if agreement.version === "seal-2"}{:else if agreement.version === "immunefi-1"}{/if}
    </tbody>
</table>

<style>
    table {
        border: 1px solid #dcdfe4;
        table-layout: auto;

        thead {
            border-bottom: 1px solid #dcdfe4;
            th {
                background: var(--bg-secondary);
                p {
                    color: var(--text-secondary);
                    font-weight: 600;
                    white-space: nowrap;
                    width: fit-content;
                }
            }
        }

        tbody {
            tr {
                td,
                th {
                    transition: background-color var(--transition-duration);
                    white-space: nowrap;
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
                margin-bottom: 0.25em;
            }
        }
    }
</style>
