<script lang="ts">
    import Navbar from "$lib/components/navbar.svelte";
    import Footer from "$lib/components/footer.svelte";

    import { browser } from "$app/environment";
    import { onMount } from "svelte";
    import { analytics } from "$lib/firebase/firebase";

    import "bootstrap/dist/css/bootstrap.min.css";
    import "../app.css";

    let { children } = $props();

    onMount(async () => {
        if (!browser) return;
        await import("bootstrap/dist/js/bootstrap.min.js"); // Javascript
    });
</script>

<Navbar />
{@render children()}
<Footer />
