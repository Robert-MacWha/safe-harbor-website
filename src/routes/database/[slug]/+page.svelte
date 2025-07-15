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

{#if safeHarbor.version === "seal-1"}
    <SafeHarborV1 {protocol} {safeHarbor} />
{:else if safeHarbor.version === "seal-2"}
    <SafeHarborV2 />
{:else if safeHarbor.version === "immunefi-1"}
    <!-- <SafeHarborImmunefiV1 /> -->
{/if}
