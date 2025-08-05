<script lang="ts">
    import type { AgreementDetailsV2 } from "$lib/firebase/types/agreementDetailsV2";

    // Form state
    let agreementDetails: AgreementDetailsV2 = $state({
        name: "",
        contact: [
            {
                name: "",
                contact: "",
            },
        ],
        chains: [],
        bountyTerms: {
            bountyCapUSD: 1_000_000,
            bountyPercentage: 10,
            diligenceRequirements: "",
            identity: "Anonymous",
            retainable: false,
            aggregateBountyCapUSD: 0,
        },
        agreementURI:
            "https://bafybeigvd7z4iemq7vrdcczgyu2afm7egxwrggftiplydc3vdrdmgccwvu.ipfs.w3s.link/The_SEAL_Whitehat_Safe_Harbor_Agremeent_V1_01.pdf",
    });

    let generatedJSON = $state("");
    let generatedTuple = $state("");

    function generateJSON() {
        generatedJSON = JSON.stringify(agreementDetails, null, 2);
    }

    function generateTuple() {
        const protocolName = agreementDetails.name;

        const contacts = agreementDetails.contact.map((contact) => [contact.contact, contact.name]);
        const chains = agreementDetails.chains.map((chain) => {
            const chainId = chain.id;

            const accounts = chain.accounts.map((account) => {
                let childScopeNumber;
                switch (account.childContractScope) {
                    case "None":
                        childScopeNumber = 0;
                        break;
                    case "ExistingOnly":
                        childScopeNumber = 1;
                        break;
                    case "All":
                        childScopeNumber = 2;
                        break;
                    case "FutureOnly":
                        childScopeNumber = 3;
                        break;
                    default:
                        childScopeNumber = 0;
                }

                return [account.address, childScopeNumber];
            });

            return [chain.assetRecoveryAddress, accounts, chainId];
        });

        let identity;
        switch (agreementDetails.bountyTerms.identity) {
            case "Anonymous":
                identity = 0;
                break;
            case "Pseudonymous":
                identity = 1;
                break;
            case "Named":
                identity = 2;
                break;
            default:
                identity = 0;
        }

        const bountyTerms = [
            agreementDetails.bountyTerms.bountyPercentage,
            agreementDetails.bountyTerms.bountyCapUSD,
            agreementDetails.bountyTerms.retainable,
            identity,
            agreementDetails.bountyTerms.diligenceRequirements,
            agreementDetails.bountyTerms.aggregateBountyCapUSD,
        ];

        const agreementURI = agreementDetails.agreementURI;

        const tuple = [protocolName, contacts, chains, bountyTerms, agreementURI];

        generatedTuple = JSON.stringify(tuple, null, 4);
    }

    function addChain() {
        agreementDetails.chains = [
            ...agreementDetails.chains,
            {
                id: "",
                assetRecoveryAddress: "",
                accounts: [
                    {
                        name: "",
                        address: "",
                        childContractScope: "None",
                        children: [],
                    },
                ],
            },
        ];
    }

    function removeChain(index: number) {
        agreementDetails.chains = agreementDetails.chains.filter((_, i) => i !== index);
    }

    function addAccount(chainIndex: number) {
        agreementDetails.chains[chainIndex].accounts = [
            ...agreementDetails.chains[chainIndex].accounts,
            {
                name: "",
                address: "",
                childContractScope: "None",
                children: [],
            },
        ];
    }

    function removeAccount(chainIndex: number, accountIndex: number) {
        if (agreementDetails.chains[chainIndex]?.accounts.length <= 1) return;

        agreementDetails.chains[chainIndex].accounts = agreementDetails.chains[chainIndex].accounts.filter(
            (_, i) => i !== accountIndex,
        );
    }

    function addContact(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
        agreementDetails.contact = [
            ...agreementDetails.contact,
            {
                name: "",
                contact: "",
            },
        ];
    }

    function removeContact(index: number) {
        if (agreementDetails.contact.length <= 1) return;
        agreementDetails.contact = agreementDetails.contact.filter((_, i) => i !== index);
    }
</script>

<svelte:head>
    <title>Safe Harbor Adoption</title>
</svelte:head>

<div class="pt-6 mt-5"></div>

<div class="info container p-4 mb-6 rounded">
    <!-- Protocol Details -->
    <div class="row mb-4">
        <div class="col-12">
            <h4 class="mb-4">Protocol Details</h4>
            <div class="row">
                <div class="col-12">
                    <label for="protocolName" class="form-label">Protocol Name *</label>
                    <input
                        type="text"
                        class="form-control"
                        id="protocolName"
                        bind:value={agreementDetails.name}
                        placeholder="Enter protocol name"
                        required
                    />
                </div>
            </div>
        </div>
    </div>

    <hr />

    <!-- Bounty Terms Section -->
    <div class="bounty col-12 col-lg pb-3">
        <h4 class="mb-4">Bounty Terms</h4>
        <div class="row">
            <div class="col mb-3" style="min-width: 20ch;">
                <label for="bountyPercentage" class="form-label">Percentage *</label>
                <div class="input-group">
                    <input
                        type="number"
                        class="form-control no-spinner"
                        id="bountyPercentage"
                        bind:value={agreementDetails.bountyTerms.bountyPercentage}
                        min="0.1"
                        max="100"
                        step="0.1"
                        required
                    />
                    <span class="input-group-text">%</span>
                </div>
            </div>
            <div class="col mb-3" style="min-width: 20ch;">
                <label for="bountyCap" class="form-label">Cap (USD) *</label>
                <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input
                        type="number"
                        class="form-control no-spinner"
                        id="bountyCap"
                        bind:value={agreementDetails.bountyTerms.bountyCapUSD}
                        min="1"
                        required
                    />
                </div>
            </div>
            <div class="col mb-3" style="min-width: 20ch;">
                <label for="aggregateBountyCap" class="form-label">Max Cap (USD)</label>
                <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input
                        type="number"
                        class="form-control no-spinner"
                        id="aggregateBountyCap"
                        bind:value={agreementDetails.bountyTerms.aggregateBountyCapUSD}
                        min="0"
                    />
                </div>
            </div>
            <div class="col mb-3" style="min-width: 20ch;">
                <label for="retainable" class="form-label">Retainable</label>
                <select class="form-select" id="retainable" bind:value={agreementDetails.bountyTerms.retainable}>
                    <option value={false}>No</option>
                    <option value={true}>Yes</option>
                </select>
            </div>
            <div class="col mb-3" style="min-width: 20ch;">
                <label for="identity" class="form-label">Identity</label>
                <select class="form-select" id="identity" bind:value={agreementDetails.bountyTerms.identity}>
                    <option value="Anonymous">Anonymous</option>
                    <option value="Pseudonymous">Pseudonymous</option>
                    <option value="Named">Named</option>
                </select>
            </div>
        </div>
        <div class="row">
            <div class="col-12 col-lg-9 mb-3">
                <label for="diligenceRequirements" class="form-label">Diligence Requirements</label>
                <textarea
                    class="form-control"
                    id="diligenceRequirements"
                    rows="3"
                    bind:value={agreementDetails.bountyTerms.diligenceRequirements}
                    placeholder="Describe the diligence requirements..."
                ></textarea>
            </div>
        </div>
    </div>

    <hr />

    <!-- Contact Details Section -->
    <div class="contact col-12 col-md pb-3">
        <h4 class="mb-4">Contact Details</h4>

        <div class="table-responsive">
            <table class="table">
                <colgroup>
                    <col style="width: 200px" />
                    <col style="width: auto" />
                    <col style="width: 50px" />
                </colgroup>
                <thead>
                    <tr>
                        <th scope="col">Name *</th>
                        <th scope="col">Contact Information *</th>
                        <th scope="col">
                            <div class="text-center">
                                <button type="button" class="btn-material" onclick={addContact} title="Add Contact">
                                    <span class="material-icon">+</span>
                                </button>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {#each agreementDetails.contact as contact, contactIndex}
                        <tr>
                            <td>
                                <input
                                    type="text"
                                    class="form-control form-control-sm"
                                    bind:value={contact.name}
                                    placeholder="Contact name"
                                    required
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    class="form-control form-control-sm"
                                    bind:value={contact.contact}
                                    placeholder="email@example.com or @username"
                                    required
                                />
                            </td>
                            <td class="text-center">
                                <button
                                    type="button"
                                    class="btn-material text-danger"
                                    onclick={() => removeContact(contactIndex)}
                                    title="Remove Contact"
                                >
                                    <span class="material-icon">-</span>
                                </button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>

    <hr />

    <!-- Chains Section -->
    <div class="chains py-3">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="mb-0">Chains & Assets</h4>
            <button type="button" class="btn-material" onclick={addChain} title="Add Chain">
                <span class="material-icon">+</span>
            </button>
        </div>

        {#each agreementDetails.chains as chain, chainIndex}
            <div class="card mb-3">
                <div class="card-body">
                    <div class="d-flex gap-3 flex-wrap mb-3">
                        <div class="flex-fill" style="min-width: 300px;">
                            <label for="recoveryAddress{chainIndex}" class="form-label">Asset Recovery Address *</label>
                            <input
                                type="text"
                                class="form-control font-monospace"
                                id="recoveryAddress{chainIndex}"
                                bind:value={chain.assetRecoveryAddress}
                                placeholder="0x..."
                                style="min-width: 0;"
                                required
                            />
                        </div>
                        <div class="flex-shrink-0" style="min-width: 200px; max-width: 20ch;">
                            <label for="chainId{chainIndex}" class="form-label">Chain ID *</label>
                            <input
                                type="text"
                                class="form-control"
                                id="chainId{chainIndex}"
                                bind:value={chain.id}
                                placeholder="eip155:1"
                                style="width: 100%;"
                                required
                            />
                        </div>
                        <div class="flex-shrink-0 d-flex flex-column">
                            <label for="removeChain{chainIndex}" class="form-label">&nbsp;</label>
                            <button
                                type="button"
                                class="btn-material text-danger align-self-end"
                                onclick={() => removeChain(chainIndex)}
                                id="removeChain{chainIndex}"
                                title="Remove Chain"
                            >
                                <span class="material-icon">-</span>
                            </button>
                        </div>
                    </div>

                    <!-- Accounts -->
                    <div class="mb-3">
                        <h6 class="mb-3">Accounts</h6>

                        <div class="table-responsive">
                            <table class="table">
                                <colgroup>
                                    <col style="width: auto" />
                                    <col style="width: 200px" />
                                    <col style="width: 10px" />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th scope="col">Address *</th>
                                        <th scope="col">Child Scope</th>
                                        <th scope="col">
                                            <div class="text-center">
                                                <button
                                                    type="button"
                                                    class="btn-material"
                                                    onclick={() => addAccount(chainIndex)}
                                                    title="Add Account"
                                                >
                                                    <span class="material-icon">+</span>
                                                </button>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {#each chain.accounts as account, accountIndex}
                                        <tr>
                                            <td>
                                                <input
                                                    type="text"
                                                    class="form-control form-control-sm font-monospace"
                                                    bind:value={account.address}
                                                    placeholder="0x..."
                                                    required
                                                />
                                            </td>
                                            <td>
                                                <select
                                                    class="form-select form-select-sm"
                                                    bind:value={account.childContractScope}
                                                >
                                                    <option value="None">None</option>
                                                    <option value="ExistingOnly">Existing Only</option>
                                                    <option value="FutureOnly">Future Only</option>
                                                    <option value="All">All</option>
                                                </select>
                                            </td>
                                            <td class="text-center">
                                                <button
                                                    type="button"
                                                    class="btn-material text-danger"
                                                    onclick={() => removeAccount(chainIndex, accountIndex)}
                                                    title="Remove Account"
                                                >
                                                    <span class="material-icon">-</span>
                                                </button>
                                            </td>
                                        </tr>
                                    {/each}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        {/each}
    </div>

    <hr />

    <!-- Generate Output Section -->
    <div class="generate-output py-3">
        <h4 class="mb-4">Generate Output</h4>

        <div class="d-flex gap-3 mb-4">
            <button type="button" class="btn btn-success" onclick={generateJSON}> Generate JSON </button>
            <button type="button" class="btn btn-primary" onclick={generateTuple}> Generate Blockchain Tuple </button>
        </div>

        {#if generatedJSON}
            <div class="mb-4">
                <label for="jsonOutput" class="form-label">Generated JSON</label>
                <textarea class="form-control" id="jsonOutput" rows="15" readonly bind:value={generatedJSON}></textarea>
                <div class="mt-2">
                    <button
                        type="button"
                        class="btn btn-outline-primary btn-sm"
                        onclick={() => navigator.clipboard.writeText(generatedJSON)}
                    >
                        Copy JSON to Clipboard
                    </button>
                </div>
            </div>
        {/if}

        {#if generatedTuple}
            <div class="mb-4">
                <label for="tupleOutput" class="form-label">Generated Blockchain Tuple</label>
                <textarea
                    class="form-control font-monospace"
                    id="tupleOutput"
                    rows="20"
                    readonly
                    bind:value={generatedTuple}
                ></textarea>
                <div class="mt-2">
                    <button
                        type="button"
                        class="btn btn-outline-primary btn-sm"
                        onclick={() => navigator.clipboard.writeText(generatedTuple)}
                    >
                        Copy Tuple to Clipboard
                    </button>
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    .info {
        background-color: var(--accent-light);
        border: 2px solid var(--accent-secondary);
        overflow-x: auto;
        overflow-y: hidden;
    }

    .form-control:focus,
    .form-select:focus {
        border-color: var(--accent-primary);
        box-shadow: 0 0 0 0.2rem rgba(var(--accent-primary-rgb), 0.25);
    }

    .card {
        border-color: var(--accent-secondary);
    }

    /* Remove number input spinners */
    .no-spinner::-webkit-outer-spin-button,
    .no-spinner::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    .no-spinner[type="number"] {
        -moz-appearance: textfield;
        appearance: textfield;
    }

    /* Simple Material-style Buttons */
    .btn-material {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border: none;
        background: transparent;
        color: #000;
        font-size: 24px;
        font-weight: 300;
        cursor: pointer;
        transition: all 0.15s ease;
        border-radius: 50%;
    }

    .btn-material:hover {
        background: rgba(0, 0, 0, 0.1);
    }

    .btn-material:active {
        background: rgba(0, 0, 0, 0.2);
    }

    .material-icon {
        font-family:
            system-ui,
            -apple-system,
            sans-serif;
        font-style: normal;
        line-height: 1;
        user-select: none;
    }
</style>
