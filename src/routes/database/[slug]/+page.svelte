<script lang="ts">
    import SafeHarborImmunefiV1 from "$lib/components/safe-harbor/safe-harbor-immunefi-v1.svelte";
    import SafeHarborCantinaV1 from "$lib/components/safe-harbor/safe-harbor-cantina-v1.svelte";
    import SafeHarborV1 from "$lib/components/safe-harbor/safe-harbor-v1.svelte";
    import SafeHarborV2 from "$lib/components/safe-harbor/safe-harbor-v2.svelte";

    const { data } = $props();
    const protocol = data.protocol;
    const safeHarbor = protocol.safeHarborContent;
    const origin = data.origin;

    let structured = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "${protocol.name}",
        applicationCategory: "FinanceApplication",
        description:
            "DeFi protocol with Safe Harbor agreement for whitehat asset recovery",
        mainEntity: {
            "@type": "Organization",
            name: "SEAL - Security Alliance",
            url: `${origin}/safe-harbor/`,
            description:
                "The Security Alliance operates the Whitehat Safe Harbor initiative to protect whitehats and protocols during active exploits",
        },
    };
</script>

<svelte:head>
    <title>{protocol.name} - Safe Harbor Database</title>
    <meta
        name="description"
        content="Details of the Safe Harbor agreement between {protocol.name} and whitehat hackers to facilitate asset recovery during active exploits."
    />
    <link
        rel="canonical"
        href="{origin}/safe-harbor/database/{protocol.slug}"
    />

    <!-- Open Graph -->
    <meta
        property="og:title"
        content="{protocol.name} - Safe Harbor Database"
    />
    <meta
        property="og:description"
        content="Details of the Safe Harbor agreement between {protocol.name} and whitehat hackers to facilitate asset recovery during active exploits."
    />
    <meta property="og:type" content="article" />
    <meta
        property="og:url"
        content="{origin}/safe-harbor/database/{protocol.slug}"
    />
    <meta property="og:image" content="{origin}/safe-harbor/og-image.png" />
    <meta property="og:site_name" content="Safe Harbor" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta
        name="twitter:title"
        content="{protocol.name} - Safe Harbor Database"
    />
    <meta
        name="twitter:description"
        content="Details of the Safe Harbor agreement between {protocol.name} and whitehat hackers to facilitate asset recovery during active exploits."
    />
    <meta name="twitter:image" content="{origin}/safe-harbor/og-image.png" />

    <!-- Structured Data -->
    {@html `<script type="application/ld+json">${JSON.stringify(structured)}</script>`}
</svelte:head>

<div class="db pb-1">
    {#if safeHarbor?.version === "seal-1"}
        <SafeHarborV1 {protocol} {safeHarbor} />
    {:else if safeHarbor?.version === "seal-2"}
        <SafeHarborV2 {protocol} {safeHarbor} />
    {:else if safeHarbor?.version === "immunefi-1"}
        <SafeHarborImmunefiV1 {protocol} {safeHarbor} />
    {:else if safeHarbor?.version === "cantina-1"}
        <SafeHarborCantinaV1 {protocol} {safeHarbor} />
    {:else}
        <p class="p-4">Safe Harbor Agreement version not supported.</p>
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
