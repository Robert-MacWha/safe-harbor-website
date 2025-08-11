<script lang="ts">
    import type { SafeHarborAgreement } from "$lib/firebase/types/safeHarborAgreement";
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
        <col style="width: 200px" />
        <col style="width: 200px" />
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
        {:else if agreement.version === "seal-2"}
            {#each agreement.agreementDetails.chains as chain}
                {#if chain.accounts}
                    {#each chain.accounts as account}
                        <DirectAsset
                            chainID={chain.caip2ChainId}
                            address={account.address}
                            name={account.name}
                            childContractScope={account.childContractScope}
                            hasChildren={account.children && account.children.length > 0}
                        />
                        {#if account.children}
                            {#each account.children as child}
                                <ChildAsset
                                    chainID={chain.caip2ChainId}
                                    parentAddress={account.address}
                                    address={child.address}
                                    name={child.name}
                                />
                            {/each}
                        {/if}
                    {/each}
                {/if}
            {/each}
        {:else if agreement.version === "immunefi-1"}
            {#each agreement.agreementDetails.chains as chain}
                {#if chain.accounts}
                    {#each chain.accounts as account}
                        <DirectAsset
                            chainID={chain.id}
                            address={account.address}
                            name={account.name}
                            childContractScope={"None"}
                            hasChildren={false}
                        />
                    {/each}
                {/if}
            {/each}{/if}
    </tbody>
</table>
