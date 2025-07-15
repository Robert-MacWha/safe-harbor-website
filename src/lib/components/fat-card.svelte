<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        image?: string;
        subtitle?: string;
        title?: string;
        children?: Snippet;
    }

    let { image, subtitle, title, children }: Props = $props();
</script>

<div class="rounded shadow p-4 flex-fill mb-4">
    <div class="card flex-fill">
        {#if subtitle}
            <h6>{subtitle}</h6>
        {/if}
        {#if image}
            <img src={image} alt="Card display" class="card-img-top" />
        {/if}
        {#if title}
            <h3>{title}</h3>
        {/if}
        {@render children?.()}
    </div>
</div>

<style lang="scss">
    .card {
        border: none;
    }

    .card-img-top {
        border-radius: var(--border-radius);
        width: 100%;
        height: auto;
    }
</style>
