<script lang="ts">
    import { PrettyCurrency } from "$lib/currency";

    interface Props {
        percentage: number;
        cap: number;
        retainable: string;
        identity: string;
        diligenceRequirements: string;
    }

    let { percentage, cap, retainable, identity, diligenceRequirements }: Props = $props();
</script>

<h4 class="mb-4">Bounty Terms</h4>
<div class="row">
    <div class="col-12 col-sm">
        <p class="mb-0">Percentage</p>
        <p class="fw-semibold">
            {#if percentage}{percentage}%
            {:else}Unavailable{/if}
        </p>
    </div>
    <div class="col-12 col-sm">
        <p class="mb-0">Cap</p>
        <p class="fw-semibold">
            {#if cap}{PrettyCurrency(cap)}%
            {:else}Unavailable{/if}
        </p>
    </div>
    <div class="col-12 col-sm">
        <p class="mb-0">Retainable</p>
        <p class="fw-semibold">
            {retainable}
        </p>
    </div>
    <div class="col-12 col-sm">
        <p class="mb-0">Identity</p>
        <p class="fw-semibold">
            {identity}
        </p>
    </div>
</div>
<div class="row">
    <div class="col-12">
        <p class="mb-0">Diligence Requirements</p>
        <p class="fw-semibold">
            {diligenceRequirements}
        </p>
    </div>
</div>
