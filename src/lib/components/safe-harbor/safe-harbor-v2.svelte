<script lang="ts">
    import type { Protocol } from "$lib/firebase/types/protocol";
    import type { SafeHarborAgreementV2 } from "$lib/firebase/types/safeHarborAgreement";
    import SafeHarborHero from "./safe-harbor-hero.svelte";
    import SafeharborBountyTerms from "./safeharbor-bounty-terms.svelte";
    import { GetChain } from "$lib/chains";
    import SafeharborAssetsUnderScope from "./safeharbor-assets-under-scope.svelte";
    import SafeharborV2RecoveryAddresses from "./safeharbor-v2-recovery-addresses.svelte";

    interface Props {
        protocol: Protocol;
        safeHarbor: SafeHarborAgreementV2;
    }

    let { protocol, safeHarbor }: Props = $props();
    const chain = GetChain(safeHarbor.registryChainId);
    const bountyTerms = safeHarbor.agreementDetails.bountyTerms;
    const date = new Date(safeHarbor.createdAt);
    const dateStr = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(date);
</script>

<div class="pt-6 mt-5"></div>

<SafeHarborHero
    name={protocol.name}
    website={protocol.website}
    icon={protocol.icon}
    agreementDate={dateStr}
    agreementURI={safeHarbor.agreementDetails.agreementURI}
    {chain}
    registryTransaction={safeHarbor.registryTransaction}
    adoptionProposalURI={safeHarbor.adoptionProposalURI}
    bugBountyPage={protocol.bugBounty}
/>

<div class="info container p-4 mb-6 rounded">
    <div class="row">
        <div class="bounty col-12 col-lg pb-3">
            <SafeharborBountyTerms
                percentage={bountyTerms.bountyPercentage}
                cap={bountyTerms.bountyCapUSD}
                retainable={bountyTerms.retainable ? "true" : "false"}
                identity={bountyTerms.identity}
                diligenceRequirements={bountyTerms.diligenceRequirements}
                aggregateCap={bountyTerms.aggregateBountyCapUSD}
            />
        </div>
        <hr id="bounty-hr" />
        <div class="contact col-12 col-md pb-3">
            <h4 class="mb-4">Contact Details</h4>
            <div class="fw-semibold mb-0">
                <p>{@html safeHarbor.agreementDetails.contact}</p>
            </div>
        </div>
    </div>

    <hr />

    <div class="recovery-addresses py-3">
        <h4 class="mb-4">Asset Recovery Addresses</h4>
        <div class="overflow-x-auto overflow-y-hidden">
            <SafeharborV2RecoveryAddresses
                chains={safeHarbor.agreementDetails.chains}
            />
        </div>
    </div>

    <hr />

    <div class="assets pb-1">
        <h4 class="mb-4">Assets</h4>
        <div class="overflow-x-auto overflow-y-hidden">
            <SafeharborAssetsUnderScope agreement={safeHarbor} />
        </div>
    </div>
</div>

<style>
    .info {
        background-color: var(--accent-light);
        border: 2px solid var(--accent-secondary);
        overflow-x: auto;
        overflow-y: hidden;
    }
</style>
