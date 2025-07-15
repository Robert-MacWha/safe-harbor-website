<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        children: Snippet;
    }

    let { children }: Props = $props();
</script>

<div class="container-glass d-flex">
    {@render children?.()}
</div>

<style lang="scss">
    .container-glass {
        width: fit-content;
        margin: auto;

        /* From https://css.glass */
        background: rgba(var(--accent-secondary), 0.2);
        border: 2px solid var(--accent-secondary);
        border-radius: var(--border-radius);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);

        box-shadow: -11.37px 11.37px 11.37px 0px #ffffff17 inset;
        box-shadow: 11.37px -11.37px 11.37px 0px #b8bcc217 inset;
    }
</style>
