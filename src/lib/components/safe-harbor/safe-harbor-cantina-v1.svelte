<script lang="ts">
    import type { Protocol } from "$lib/firebase/types/protocol";
    import type { SafeHarborAgreementCantinaV1 } from "$lib/firebase/types/safeHarborAgreement";
    import SafeHarborHero from "./safe-harbor-hero.svelte";
    import SafeharborAssetsUnderScope from "./safeharbor-assets-under-scope.svelte";
    import SafeharborBountyTerms from "./safeharbor-bounty-terms.svelte";

    interface Props {
        protocol: Protocol;
        safeHarbor: SafeHarborAgreementCantinaV1;
    }

    let { protocol, safeHarbor }: Props = $props();
    console.log(safeHarbor);
    const bountyTerms = safeHarbor.agreementDetails.bountyTerms;
</script>

<div class="pt-6 mt-5"></div>

<SafeHarborHero
    name={protocol.name}
    website={protocol.website}
    icon={protocol.icon}
    bugBountyPage={safeHarbor.agreementDetails.cantinaUrl}
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
            />
        </div>
        <hr id="bounty-hr" />
        <div class="contact col-12 col-md pb-3">
            <h4 class="mb-4">Contact Details</h4>
            <div class="fw-semibold mb-0">
                <p>
                    {@html safeHarbor.agreementDetails.contact.replaceAll(
                        "\n",
                        "<br>",
                    )}
                </p>
            </div>
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
