<script lang="ts">
    import GlassContainer from "$lib/components/glass-container.svelte";
    import GlassCard from "$lib/components/glass-card.svelte";
    import FatCard from "$lib/components/fat-card.svelte";

    import magnifierImg from "$lib/images/magnifier.png";
    import messagesImg from "$lib/images/messages.png";
    import securityImg from "$lib/images/security.png";
    import whyImg from "$lib/images/why.svg";

    import { PrettyCurrency } from "$lib/currency";

    const { data } = $props();
    const protocols = data.protocols;

    let tvl = $state(0);
    for (const protocol of data.protocols) {
        tvl += protocol.tvl;
    }
</script>

<svelte:head>
    <title>Safe Harbor</title>
</svelte:head>

<div class="pt-4"></div>

<div class="hero mt-6 pt-6 pb-6">
    <div class="container d-flex flex-column align-items-center text-center">
        <div>
            <h1>Empowering Whitehats,<br />Protecting Protocols</h1>
            <div class="mb-3"></div>
        </div>

        <div class="row w-100">
            <div class="col-lg-2"></div>
            <div class="col">
                <h5>
                    Join forces with whitehats through the Safe Harbor initiative to create a robust defense against
                    hacks.
                </h5>
                <div class="mb-4"></div>

                <GlassContainer>
                    <div class="row px-5 py-4">
                        <div class="col px-4">
                            <h3>{protocols.length}</h3>
                            <p class="text-center text-nowrap mb-0">Protocols</p>
                        </div>
                        <div class="col px-4">
                            <h3>${PrettyCurrency(tvl)}</h3>
                            <p class="text-center text-nowrap mb-0">Protected</p>
                        </div>
                    </div>
                </GlassContainer>
            </div>
            <div class="col-lg-2"></div>
        </div>
    </div>
</div>

<div class="why container pt-6 pb-6">
    <div class="row">
        <div class="col-12 col-lg gx-5 d-flex align-items-center justify-content-center mb-4">
            <div>
                <h2>Why Safe Harbor?</h2>
                <p>
                    Over the past years, billions of dollars have been lost to crypto hacks. The Safe Harbor initiative
                    seeks to reduce these losses by enabling whitehats to protect vulnerable funds. By joining,
                    protocols can set up clear asset recovery procedures, including recovery addresses and bounty terms.
                    This initiative provides legal protection for whitehats, allowing them to secure at-risk assets
                    without fear of legal consequences. Ultimately, it offers protocols enhanced security from
                    third-party whitehats at no additional cost.
                </p>
            </div>
        </div>
        <div class="col-12 col-lg d-flex align-items-center justify-content-center">
            <img src={whyImg} alt="Hero" class="img-fluid showcase" />
        </div>
    </div>
</div>

<div class="how container pt-6 pb-6">
    <h2>How it Works?</h2>
    <p>
        The Safe Harbor initiative functions similarly to a bug bounty program but focuses on active exploits—situations
        where a vulnerability is currently being exploited by a malicious actor. By pre-establishing a framework for
        responding to active exploits, whitehats will have clarity on how to act and will be more likely to intervene.
    </p>

    <div class="pb-3"></div>

    <div class="row">
        <div class="col-12 col-md d-flex mb-3">
            <GlassCard
                icon={magnifierImg}
                title="Review and Decide"
                text="Protocols evaluate the Safe Harbor agreement and decide on key terms, such as in-scope assets and reward structures."
            />
        </div>
        <div class="col-12 col-md d-flex mb-3">
            <GlassCard
                icon={messagesImg}
                title="Governance Proposal"
                text="For DAOs, a governance proposal is created and voted on to adopt the Safe Harbor agreement."
            />
        </div>
        <div class="col-12 col-md d-flex mb-3">
            <GlassCard
                icon={securityImg}
                title="Adoption"
                text="Include the agreement in the protocol's website terms of service and execute an on-chain governance transaction to formalize the adoption."
            />
        </div>
    </div>
</div>

<div class="interested pt-6 pb-6">
    <div class="container">
        <h2 class="mb-3">Interested in Joining?</h2>

        <div class="row mb-4">
            <div class="col-12 col-md d-flex">
                <FatCard title="Step 1">
                    <p>View the protocols that have already signed up and learn about their agreements.</p>

                    <a href="/">View Safe Harbor database</a>
                </FatCard>
            </div>
            <div class="col-12 col-md d-flex">
                <FatCard title="Step 2">
                    <p>Contact us now to adopt Safe Harbor</p>
                    <a href="https://form.typeform.com/to/QF3YjWno">Sign up here</a>
                </FatCard>
            </div>
        </div>
        <p>
            For a comprehensive guide on adopting the Safe Harbor initiative, refer to our detailed <a
                href="https://frameworks.securityalliance.dev/safe-harbor/index.html">written guide</a
            >
        </p>
    </div>
</div>

<style>
    .hero {
        background: url("$lib/images/hero.svg") top center;
        background-size: cover;
        color: white;
    }

    .interested {
        background: linear-gradient(180deg, rgba(240, 246, 255, 0) 0%, #f0f6ff 100%);
    }
</style>
