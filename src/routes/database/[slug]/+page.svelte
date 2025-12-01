<script lang="ts">
    import SafeHarborImmunefiV1 from "$lib/components/safe-harbor/safe-harbor-immunefi-v1.svelte";
    import SafeHarborV1 from "$lib/components/safe-harbor/safe-harbor-v1.svelte";
    import SafeHarborV2 from "$lib/components/safe-harbor/safe-harbor-v2.svelte";

    let { data } = $props();
    const protocol = data.protocol;
    const safeHarbor = protocol.safeHarborContent;
</script>

<svelte:head>
    <title>{protocol.name} - Safe Harbor Database</title>
</svelte:head>

<div class="db pb-1">
    {#if safeHarbor.version === "seal-1"}
        <SafeHarborV1 {protocol} {safeHarbor} />
    {:else if safeHarbor.version === "seal-2"}
        <SafeHarborV2 {protocol} {safeHarbor} />
    {:else if safeHarbor.version === "immunefi-1"}
        <SafeHarborImmunefiV1 {protocol} {safeHarbor} />
    {/if}
</div>

<style>
    .db {
        background: linear-gradient(
            180deg,
            rgba(240, 246, 255, 0) 0%,
            #f0f6ff 100%
        );
        height: fit-content;
    }
</style>
