<script lang="ts">
    import { PrettyCurrency } from "$lib/currency";
    import ChainIcon from "$lib/components/chain-icon.svelte";
    import LockIcon from "$lib/images/database/lock.png";
    import MoneyIcon from "$lib/images/database/money.png";
    import { parse } from "yaml";
    import RescueDetailsDropdown from "$lib/components/rescue-details-dropdown.svelte";

    interface Rescue {
        protocol: string;
        whitehat: string;
        date: string;
        chain: number;
        value: number;
        value_tokens: Array<Record<string, number>>;
        report: string;
        note: string;
        whitehat_transactions: string[];
        recovery_transactions: string[];
        safe_harbor: boolean;
    }

    const files = import.meta.glob("./rescues/*.yaml", {
        eager: true,
        as: "raw",
    });

    let rescues: Rescue[] = Object.values(files).map(
        (raw) => parse(raw as string) as Rescue,
    );

    rescues = rescues
        .filter((r) => r != null)
        .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );

    const rescueCount = rescues.length;
    const rescueValue = rescues.reduce(
        (acc, rescue) => acc + (rescue.value || 0),
        0,
    );
</script>

<svelte:head>
    <title>Whitehat Rescues</title>
</svelte:head>

<div class="pt-4 mt-2"></div>

<div class="hero mt-6 py-5">
    <div class="container d-flex flex-column align-items-center text-center">
        <div>
            <h2 class="mb-4">Whitehat Rescues</h2>
        </div>

        <div class="row w-100">
            <div class="col-lg-2"></div>
            <div class="col">
                <div class="row">
                    <div class="col-10 col-md-6 mb-3 mx-auto">
                        <div
                            class="card flex-fill py-2 px-3 rounded text-start"
                        >
                            <p class="mb-1">Whitehat Rescues</p>
                            <h4 class="mb-0">{rescueCount}</h4>
                            <img
                                src={LockIcon}
                                class="card-img-top"
                                alt="icon"
                            />
                        </div>
                    </div>
                    <div class="col-10 col-md-6 mb-3 mx-auto">
                        <div
                            class="card flex-fill py-2 px-3 rounded text-start"
                        >
                            <p class="mb-1">Assets Saved</p>
                            <h4 class="mb-0">{PrettyCurrency(rescueValue)}</h4>
                            <img
                                src={MoneyIcon}
                                class="card-img-top"
                                alt="icon"
                            />
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
        <h4>Whitehat Rescues</h4>
        <p>
            This page aims to record all known whitehat rescues where security
            researchers have helped save assets from protocols under active
            exploit, often racing the hacker to secure the funds. Over the years
            whitehat actions have saved tens of millions of dollars in Defi.
        </p>
        <p>
            SEAL Safe Harbor encourages these good-faith actors by providing a
            legal framework for responsible disclosure and asset recovery. All
            credit for the rescues goes to the whitehats.
        </p>

        <div class="overflow-x-auto overflow-y-hidden">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col" class="p-3">Whitehat</th>
                        <th scope="col" class="p-3">Protocol</th>
                        <th scope="col" class="p-3">Chain</th>
                        <th scope="col" class="p-3">Value Saved</th>
                        <th scope="col" class="p-3">Date</th>
                        <th scope="col" class="p-3">Safe Harbor</th>
                    </tr>
                </thead>
                <tbody>
                    {#each rescues as rescue, index}
                        {@const rescueId = `rescue-${index}`}
                        {@const hasDetails =
                            (rescue.value_tokens &&
                                rescue.value_tokens.length > 0) ||
                            (rescue.whitehat_transactions &&
                                rescue.whitehat_transactions.length > 0) ||
                            (rescue.recovery_transactions &&
                                rescue.recovery_transactions.length > 0)}
                        <tr
                            data-aos="fade-up"
                            data-aos-anchor-placement="top-bottom"
                            data-aos-duration="600"
                        >
                            <th scope="row" class="p-3 whitehat-column">
                                {#if hasDetails}
                                    <button
                                        class="btn btn-link p-0"
                                        type="button"
                                        onclick={() => {
                                            const childrenRows =
                                                document.querySelectorAll<HTMLElement>(
                                                    `.child-of-${rescueId}`,
                                                );
                                            childrenRows.forEach((row) => {
                                                row.style.display =
                                                    row.style.display === "none"
                                                        ? ""
                                                        : "none";
                                            });
                                        }}
                                    >
                                        <span
                                            class="down material-symbols-outlined"
                                            >keyboard_arrow_down</span
                                        >
                                    </button>
                                {/if}
                                <p>{rescue.whitehat}</p>
                            </th>
                            <td class="p-3">
                                <p>{rescue.protocol}</p>
                            </td>
                            <td class="p-3">
                                <ChainIcon chainID={rescue.chain} />
                            </td>
                            <td class="p-3">
                                <p>{PrettyCurrency(rescue.value)}</p>
                            </td>
                            <td class="p-3">
                                <p>{rescue.date}</p>
                            </td>
                            <td class="p-3">
                                {#if rescue.safe_harbor}
                                    <p>✅</p>
                                {/if}
                            </td>
                        </tr>
                        {#if hasDetails}
                            <RescueDetailsDropdown {rescue} {rescueId} />
                        {/if}
                    {/each}
                </tbody>
            </table>
        </div>

        <p>
            Values saved are estimates based on token prices at the time of fund
            recovery or, where unavailable, at the time of the whitehat
            transaction. Token prices can be incredibly volatile during active
            exploits so these values should be treated as order-of-magnitude
            estimates rather than exact figures. For more precise values, see
            the individually reported tokens.
        </p>
        <p>
            If you know of a whitehat rescue that is not listed here, please
            submit an issue on our <a
                href="https://github.com/Robert-MacWha/safe-harbor-website"
                >GitHub repository</a
            >. More information about the whitehat rescues listed here can also
            be found in our repository, including links to reports and
            transaction hashes.
        </p>
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
        background: linear-gradient(
            180deg,
            rgba(240, 246, 255, 0) 0%,
            #f0f6ff 100%
        );

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
                    color: var(--text-secondary);
                    font-weight: 600;
                    white-space: nowrap;
                    width: fit-content;
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

                .whitehat-column {
                    position: relative;
                    padding-left: 2.5rem !important;

                    button {
                        color: var(--text-secondary);
                        position: absolute;
                        top: 50%;
                        left: 0.5rem;
                        transform: translateY(-50%);
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
