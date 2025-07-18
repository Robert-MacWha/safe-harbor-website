<script lang="ts">
    import ChainIcon from "$lib/components/chain-icon.svelte";
    import lockIcon from "$lib/images/database/lock.png";
    import moneyIcon from "$lib/images/database/money.png";

    import { PrettyCurrency } from "$lib/currency";

    let { data } = $props();
    const protocols = data.protocols;

    let scopedTVL = $state(0);
    for (const protocol of protocols) {
        scopedTVL += protocol.tvl;
    }
</script>

<svelte:head>
    <title>Safe Harbor</title>
</svelte:head>

<div class="pt-4 mt-2"></div>

<div class="hero mt-6 py-5">
    <div class="container d-flex flex-column align-items-center text-center">
        <div>
            <h2 class="mb-4">SEAL Whitehat Safe Harbor</h2>
        </div>

        <div class="row w-100">
            <div class="col-lg-2"></div>
            <div class="col">
                <div class="row">
                    <div class="col-10 col-sm-6 mb-3 mx-auto">
                        <div class="card flex-fill py-2 px-3 rounded text-start">
                            <p class="mb-1">Protocols under Scope</p>
                            <h4 class="mb-0">{protocols.length}</h4>
                            <img src={lockIcon} class="card-img-top" alt="icon" />
                        </div>
                    </div>
                    <div class="col-10 col-sm-6 mb-3 mx-auto">
                        <div class="card flex-fill py-2 px-3 rounded text-start">
                            <p class="mb-1">Assets under scope</p>
                            <h4 class="mb-0">${PrettyCurrency(scopedTVL)}</h4>
                            <img src={moneyIcon} class="card-img-top" alt="icon" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-2"></div>
        </div>
    </div>
</div>

<div class="db">
    <div class="container py-5">
        <div class="overflow-x-auto overflow-y-hidden">
            {#if protocols.length === 0}
                <div class="text-center">
                    <h3>No Adoptions Found</h3>
                    <p>
                        We're encountering a database issue, please check again in an hour or reference the <a
                            href="https://github.com/security-alliance/safe-harbor">on-chain database</a
                        >.
                    </p>
                </div>
            {:else}
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col" class="p-3"><p class="mb-0">Protocol Name</p></th>
                            <th scope="col" class="p-3"><p class="mb-0">TVL</p></th>
                            <th scope="col" class="p-3"><p class="mb-0">Chain(s)</p></th>
                            <th scope="col" class="p-3"><p class="mb-0">Category</p></th>
                        </tr>
                    </thead>

                    <tbody>
                        {#each protocols as protocol}
                            <tr data-aos="fade-up" data-aos-anchor-placement="top-bottom" data-aos-duration="600">
                                <th scope="row" class="p-3"
                                    ><a href="/database/{protocol.slug}" class="d-flex flex-row align-items-center">
                                        {#if protocol.icon}
                                            <img src={protocol.icon} alt="Icon" />
                                        {/if}
                                        <p class="ms-2 mb-0">
                                            {protocol.name}
                                        </p>
                                    </a></th
                                >
                                <td class="p-3"><p>${PrettyCurrency(protocol.tvl)}</p></td>
                                <td class="p-3">
                                    <div class="d-flex flex-row">
                                        {#if protocol.safeHarborContent.agreementDetails.chains}
                                            {#each protocol.safeHarborContent.agreementDetails.chains.slice(0, 6) as chain}
                                                <ChainIcon chainID={chain.id} lazy />
                                            {/each}
                                            {#if protocol.safeHarborContent.agreementDetails.chains.length > 6}
                                                <span>...</span>
                                            {/if}
                                        {/if}
                                    </div>
                                </td>
                                <td class="p-3"
                                    ><p>
                                        {protocol.category ? protocol.category : ""}
                                    </p></td
                                >
                            </tr>
                        {/each}
                    </tbody>
                </table>
            {/if}
        </div>
    </div>
</div>

<style>
    .hero {
        background: url("$lib/images/database/hero.svg") center;
        background-size: cover;
        color: white;

        .card {
            position: relative;
            border: 1px solid #b9d6ff;
            .card-img-top {
                width: 40px;
                height: 40px;
                aspect-ratio: 1;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                right: 15px;
            }
        }
    }

    .db {
        background: linear-gradient(180deg, rgba(240, 246, 255, 0) 0%, #f0f6ff 100%);

        .container {
            overflow-x: auto;
        }

        table {
            border: 1px solid #dcdfe4;
            table-layout: auto;
            thead {
                border-bottom: 1px solid #dcdfe4;
                th {
                    background: var(--bg-secondary);
                    p {
                        color: var(--text-secondary);
                        font-weight: 600;
                        white-space: nowrap;
                        width: fit-content;
                    }
                }
            }

            tbody {
                tr {
                    td,
                    th {
                        white-space: nowrap;
                    }

                    &:hover {
                        th,
                        td {
                            background-color: var(--bg-secondary);
                        }
                    }
                }

                p,
                a {
                    color: var(--text-secondary);
                    font-weight: 400;
                    margin-bottom: 0.25em;
                }

                img {
                    border-radius: 200px;
                    width: 32px;
                    height: 32px;
                }
            }
        }
    }
</style>
