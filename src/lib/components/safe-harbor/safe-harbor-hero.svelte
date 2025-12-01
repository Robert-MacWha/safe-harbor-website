<script lang="ts">
    import type { Chain } from "$lib/chains";
    import { PrettyCurrency } from "$lib/currency";

    interface Props {
        name: string;
        website: string;
        icon?: string;
        agreementDate?: string;
        tvl?: number;
        agreementURI?: string;
        chain?: Chain;
        registryTransaction?: string;
        adoptionProposalURI?: string;
        immunefiPage?: string;
        bugBountyPage?: string;
    }

    let props: Props = $props();

    const registryTxHref =
        props.chain && props.registryTransaction
            ? props.chain?.TXScan.replace("{tx}", props.registryTransaction)
            : undefined;
</script>

<div class="hero">
    <div class="container pt-2 mb-5">
        <div class="name mb-4">
            <div class="d-flex flex-row align-items-center">
                {#if props.icon}
                    <img src={props.icon} alt="Icon" />
                {/if}

                <div class="ms-2 id">
                    <h4 class="mb-0">{props.name}</h4>
                    <p class="mb-0">{props.website}</p>
                </div>
            </div>
        </div>
        <div class="stats">
            <div class="d-flex flex-row flex-wrap align-items-center">
                {#if props.agreementDate}
                    <div class="me-2 mb-3">
                        <p class="tag tag-secondary">
                            {props.agreementDate}
                        </p>
                    </div>
                {/if}
                {#if props.tvl}
                    <div class="me-2 mb-3">
                        <p class="tag tag-secondary">
                            ${PrettyCurrency(props.tvl)} TVL
                        </p>
                    </div>
                {/if}
                {#if props.agreementURI}
                    <div class="me-2 mb-3">
                        <a class="tag tag-secondary" href={props.agreementURI}>
                            Agreement
                        </a>
                    </div>
                {/if}
                {#if registryTxHref}
                    <div class="me-2 mb-3">
                        <a class="tag tag-secondary" href={registryTxHref}
                            >Registry Transaction</a
                        >
                    </div>
                {/if}
                {#if props.adoptionProposalURI}
                    <div class="me-2 mb-3">
                        <a
                            class="tag tag-secondary"
                            href={props.adoptionProposalURI}
                        >
                            Adoption Proposal
                        </a>
                    </div>
                {/if}
                {#if props.immunefiPage}
                    <div class="me-2 mb-3">
                        <a class="tag tag-secondary" href={props.immunefiPage}>
                            Immunefi
                        </a>
                    </div>
                {/if}
                {#if props.bugBountyPage}
                    <div class="me-2 mb-3">
                        <a class="tag tag-secondary" href={props.bugBountyPage}>
                            Bug Bounty
                        </a>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>

<style>
    .name {
        position: relative;

        img {
            border-radius: 200px;
            width: 48px;
            height: 48px;
        }
    }
</style>
