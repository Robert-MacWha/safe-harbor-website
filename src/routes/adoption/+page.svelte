<script lang="ts">
    import type {
        AgreementDetailsV2,
        Chain,
        Account,
        BountyTerms,
        Contact,
        ChildContractScope,
        IdentityRequirements,
    } from "$lib/firebase/types/agreementDetailsV2";

    // Form state
    let agreementDetails: AgreementDetailsV2 = $state({
        name: "",
        contact: [],
        chains: [],
        bountyTerms: {
            bountyCapUSD: 0,
            bountyPercentage: 0,
            diligenceRequirements: "",
            identity: "Anonymous",
            retainable: false,
        },
        agreementURI: "",
    });

    let generatedJSON = $state("");

    function generateJSON() {
        generatedJSON = JSON.stringify(agreementDetails, null, 2);
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

    function addContact() {
        agreementDetails.contact = [
            ...agreementDetails.contact,
            {
                name: "",
                contact: "",
            },
        ];
    }

    function removeContact(index: number) {
        agreementDetails.contact = agreementDetails.contact.filter((_, i) => i !== index);
    }
</script>

<svelte:head>
    <title>Safe Harbor Adoption</title>
</svelte:head>

<div class="pt-6 mt-5"></div>

<!-- Hero Section -->
<div class="container mb-5">
    <div class="row">
        <div class="col-12">
            <h1 class="display-4 mb-3">Safe Harbor Adoption</h1>
            <p class="lead">Create your Safe Harbor agreement details for on-chain deployment.</p>
        </div>
    </div>
</div>

<div class="info container p-4 mb-6 rounded">
    <!-- Protocol Details -->
    <div class="row mb-4">
        <div class="col-12">
            <h4 class="mb-4">Protocol Details</h4>
            <div class="row">
                <div class="col-12">
                    <label for="protocolName" class="form-label">Protocol Name</label>
                    <input
                        type="text"
                        class="form-control"
                        id="protocolName"
                        bind:value={agreementDetails.name}
                        placeholder="Enter protocol name"
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
            <div class="col-12 col-sm-6 col-lg-3">
                <label for="bountyPercentage" class="form-label">Percentage</label>
                <div class="input-group">
                    <input
                        type="number"
                        class="form-control no-spinner"
                        id="bountyPercentage"
                        bind:value={agreementDetails.bountyTerms.bountyPercentage}
                        min="0"
                        max="100"
                        step="0.1"
                    />
                    <span class="input-group-text">%</span>
                </div>
            </div>
            <div class="col-12 col-sm-6 col-lg-3">
                <label for="bountyCap" class="form-label">Cap (USD)</label>
                <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input
                        type="number"
                        class="form-control no-spinner"
                        id="bountyCap"
                        bind:value={agreementDetails.bountyTerms.bountyCapUSD}
                        min="0"
                    />
                </div>
            </div>
            <div class="col-12 col-sm-6 col-lg-3">
                <label for="identity" class="form-label">Identity</label>
                <select class="form-select" id="identity" bind:value={agreementDetails.bountyTerms.identity}>
                    <option value="Anonymous">Anonymous</option>
                    <option value="Pseudonymous">Pseudonymous</option>
                    <option value="Named">Named</option>
                </select>
            </div>
            <div class="col-12 col-sm-6 col-lg-3">
                <label class="form-label">Retainable</label>
                <div class="form-check">
                    <input
                        class="form-check-input"
                        type="checkbox"
                        id="retainable"
                        bind:checked={agreementDetails.bountyTerms.retainable}
                    />
                    <label class="form-check-label" for="retainable"> Retainable </label>
                </div>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-12">
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
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="mb-0">Contact Details</h4>
            <button type="button" class="btn-material" onclick={addContact} title="Add Contact">
                <span class="material-icon">+</span>
            </button>
        </div>

        {#each agreementDetails.contact as contact, contactIndex}
            <div class="border rounded p-3 mb-3">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <strong>Contact {contactIndex + 1}</strong>
                    <button
                        type="button"
                        class="btn-material text-danger"
                        onclick={() => removeContact(contactIndex)}
                        title="Remove Contact"
                    >
                        <span class="material-icon">−</span>
                    </button>
                </div>

                <div class="row">
                    <div class="col-12 col-md-4">
                        <label for="contactName{contactIndex}" class="form-label">Name</label>
                        <input
                            type="text"
                            class="form-control"
                            id="contactName{contactIndex}"
                            bind:value={contact.name}
                            placeholder="Contact name"
                        />
                    </div>
                    <div class="col-12 col-md-8">
                        <label for="contactInfo{contactIndex}" class="form-label">Contact Information</label>
                        <input
                            type="text"
                            class="form-control"
                            id="contactInfo{contactIndex}"
                            bind:value={contact.contact}
                            placeholder="email@example.com or @username"
                        />
                    </div>
                </div>
            </div>
        {:else}
            <div class="text-muted text-center py-4">
                <p>No contacts added yet. Click "+" to get started.</p>
            </div>
        {/each}
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
                            <label for="recoveryAddress{chainIndex}" class="form-label">Asset Recovery Address</label>
                            <input
                                type="text"
                                class="form-control font-monospace"
                                id="recoveryAddress{chainIndex}"
                                bind:value={chain.assetRecoveryAddress}
                                placeholder="0x..."
                                style="min-width: 0;"
                            />
                        </div>
                        <div class="flex-shrink-0" style="min-width: 200px; max-width: 20ch;">
                            <label for="chainId{chainIndex}" class="form-label">Chain ID</label>
                            <input
                                type="text"
                                class="form-control"
                                id="chainId{chainIndex}"
                                bind:value={chain.id}
                                placeholder="eip155:1"
                                style="width: 100%;"
                            />
                        </div>
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <label for="removeChain{chainIndex}" class="form-label">Remove</label>
                            <br />
                            <button
                                type="button"
                                class="btn-material text-danger"
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
                                        <th scope="col">Address</th>
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

    <!-- Generate JSON Section -->
    <div class="generate-json py-3">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="mb-0">Generate Agreement JSON</h4>
            <button type="button" class="btn btn-success" onclick={generateJSON}> Generate JSON </button>
        </div>

        {#if generatedJSON}
            <div class="mb-3">
                <label for="jsonOutput" class="form-label">Generated JSON</label>
                <textarea class="form-control" id="jsonOutput" rows="15" readonly bind:value={generatedJSON}></textarea>
            </div>
            <button type="button" class="btn btn-primary" onclick={() => navigator.clipboard.writeText(generatedJSON)}>
                Copy to Clipboard
            </button>
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
