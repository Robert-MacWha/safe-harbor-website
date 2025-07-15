<script lang="ts">
    import type { Protocol } from "$lib/firebase/types/protocol";
    import type { SafeHarborAgreementImmunefiV1 } from "$lib/firebase/types/safeHarborAgreement";
    import SafeHarborHero from "./safe-harbor-hero.svelte";

    interface Props {
        protocol: Protocol;
        safeHarbor: SafeHarborAgreementImmunefiV1;
    }

    let { protocol, safeHarbor }: Props = $props();
    const bountyTerms = safeHarbor.agreementDetails.bountyTerms;
</script>

<SafeHarborHero
    name={protocol.name}
    website={protocol.website}
    icon={protocol.icon}
    adoptionProposalURI={safeHarbor.adoptionProposalURI}
/>

<!-- <div class="row">
    <div class="bounty col-12 col-lg pb-3">
        <SafeHarborBountyTerms bountyTerms={protocol.safeHarborContent.agreementDetails.bountyTerms} />
    </div>
    <hr id="bounty-hr" />
    <div class="contact col-12 col-md pb-3">
        <h4 class="mb-4">Contact Details</h4>
        <div class="fw-semibold mb-0">
            <Markdown source={protocol.safeHarborContent.contactDetails} />
        </div>
    </div>
</div>

<hr />

<div class="recovery-addresses py-3">
    <h4 class="mb-4">Asset Recovery Addresses</h4>
    <div class="overflow-x-auto overflow-y-hidden">
        <SafeharborRecoveryAddresses chains={protocol.safeHarborContent.chains} />
    </div>
</div>

<hr />

<div class="assets pb-1">
    <h4 class="mb-4">Assets</h4>
    <div class="overflow-x-auto overflow-y-hidden">
        <SafeharborAssetsUnderScope chains={protocol.safeHarborContent.chains} />
    </div>
</div> -->
