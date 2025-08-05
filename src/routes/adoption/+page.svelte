<script lang="ts">
    import type { AgreementDetailsV2 } from "$lib/firebase/types/agreementDetailsV2";
    import {
        createDefaultAgreementDetails,
        createDefaultChain,
        createDefaultAccount,
        createDefaultContact,
        generateAgreementJSON,
        generateAgreementTuple,
        validateAgreementDetailsV2,
    } from "$lib/firebase/agreementDetailsV2Utils";
    import { connectWallet, deployAgreement } from "$lib/contracts/factory";
    import type { Address } from "viem";

    // Form state
    let agreementDetails: AgreementDetailsV2 = $state(createDefaultAgreementDetails());

    // Output state
    let output = $state("");
    let outputType = $state<"json" | "tuple" | "">("");

    // Wallet state
    let walletAddress = $state<Address | null>(null);
    let isConnecting = $state(false);
    let isDeploying = $state(false);
    let deploymentHash = $state<string | null>(null);
    let deploymentError = $state<string | null>(null);
    let walletError = $state<string | null>(null);

    // Validation
    let validationErrors = $derived(validateAgreementDetailsV2(agreementDetails));
    let isValid = $derived(validationErrors.length === 0);

    function generateJSON() {
        output = generateAgreementJSON(agreementDetails);
        outputType = "json";
    }

    function generateTuple() {
        output = generateAgreementTuple(agreementDetails);
        outputType = "tuple";
    }

    async function handleConnectWallet() {
        isConnecting = true;
        walletError = null;
        try {
            walletAddress = await connectWallet();
        } catch (error: any) {
            walletError = error.message;
        } finally {
            isConnecting = false;
        }
    }

    async function handleDeployContract() {
        if (!isValid) return;

        isDeploying = true;
        deploymentHash = null;
        deploymentError = null;

        try {
            const result = await deployAgreement(agreementDetails);
            deploymentHash = result.hash;
        } catch (error: any) {
            deploymentError = error.message;
        } finally {
            isDeploying = false;
        }
    }

    function addChain() {
        agreementDetails.chains = [...agreementDetails.chains, createDefaultChain()];
    }

    function removeChain(index: number) {
        agreementDetails.chains = agreementDetails.chains.filter((_, i) => i !== index);
    }

    function addAccount(chainIndex: number) {
        agreementDetails.chains[chainIndex].accounts = [
            ...agreementDetails.chains[chainIndex].accounts,
            createDefaultAccount(),
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
        agreementDetails.contact = [...agreementDetails.contact, createDefaultContact()];
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
                        class="form-control font-monospace"
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
                        class="form-control no-spinner font-monospace"
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
                        class="form-control no-spinner font-monospace"
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
                        class="form-control no-spinner font-monospace"
                        id="aggregateBountyCap"
                        bind:value={agreementDetails.bountyTerms.aggregateBountyCapUSD}
                        min="0"
                    />
                </div>
            </div>
            <div class="col mb-3" style="min-width: 20ch;">
                <label for="retainable" class="form-label">Retainable</label>
                <select
                    class="form-select font-monospace"
                    id="retainable"
                    bind:value={agreementDetails.bountyTerms.retainable}
                >
                    <option value={false}>No</option>
                    <option value={true}>Yes</option>
                </select>
            </div>
            <div class="col mb-3" style="min-width: 20ch;">
                <label for="identity" class="form-label">Identity</label>
                <select
                    class="form-select font-monospace"
                    id="identity"
                    bind:value={agreementDetails.bountyTerms.identity}
                >
                    <option value="Anonymous">Anonymous</option>
                    <option value="Pseudonymous">Pseudonymous</option>
                    <option value="Named">Named</option>
                </select>
            </div>
        </div>
        <div class="row">
            <div class="col mb-3">
                <label for="diligenceRequirements" class="form-label">Diligence Requirements</label>
                <textarea
                    class="form-control font-monospace"
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
                                    class="form-control form-control-sm font-monospace"
                                    bind:value={contact.name}
                                    placeholder="Contact name"
                                    required
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    class="form-control form-control-sm font-monospace"
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
                                class="form-control font-monospace"
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
                                                    class="form-select form-select-sm font-monospace"
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

    <!-- Validation Errors -->
    {#if validationErrors.length > 0}
        <div class="alert alert-danger">
            <h6>Please fix the following errors:</h6>
            <ul class="mb-0">
                {#each validationErrors as error}
                    <li>{error}</li>
                {/each}
            </ul>
        </div>
    {/if}

    <!-- Generate Output Section -->
    <div class="generate-output py-3">
        <h4 class="mb-4">Generate Output & Deploy</h4>

        <div class="row g-3 mb-4">
            <div class="col-6 col-md-4">
                <button type="button" class="btn btn-primary w-100" onclick={generateJSON} disabled={!isValid}>
                    Generate JSON
                </button>
            </div>
            <div class="col-6 col-md-4">
                <button type="button" class="btn btn-primary w-100" onclick={generateTuple} disabled={!isValid}>
                    Generate Tuple
                </button>
            </div>
            <div class="col-12 col-md-4">
                {#if !walletAddress}
                    <button
                        type="button"
                        class="btn btn-primary w-100"
                        onclick={handleConnectWallet}
                        disabled={isConnecting}
                    >
                        {isConnecting ? "Connecting..." : "Connect Wallet"}
                    </button>
                {:else}
                    <button
                        type="button"
                        class="btn btn-primary w-100"
                        onclick={handleDeployContract}
                        disabled={!isValid || isDeploying}
                    >
                        {isDeploying ? "Deploying..." : "Deploy Contract"}
                    </button>
                {/if}
            </div>
        </div>

        <!-- Error Messages -->
        {#if walletError}
            <div class="alert alert-danger">
                <h6>Wallet Connection Error</h6>
                <p class="mb-0">{walletError}</p>
            </div>
        {/if}
        
        {#if deploymentError}
            <div class="alert alert-danger">
                <h6>Deployment Error</h6>
                <p class="mb-0">{deploymentError}</p>
            </div>
        {/if}

        {#if output}
            <div class="mb-4">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <label for="output" class="form-label mb-0">
                        Generated {outputType === "json" ? "JSON" : "Blockchain Tuple"}
                    </label>
                    <button
                        type="button"
                        class="btn btn-outline-primary btn-sm"
                        onclick={() => navigator.clipboard.writeText(output)}
                    >
                        Copy to Clipboard
                    </button>
                </div>
                <textarea
                    class="form-control font-monospace"
                    id="output"
                    rows={outputType === "json" ? 15 : 20}
                    readonly
                    bind:value={output}
                ></textarea>
            </div>
        {/if}

        {#if deploymentHash}
            <div class="alert alert-success">
                <h6>Contract Deployed Successfully!</h6>
                <p class="mb-0">Transaction Hash: <code class="font-monospace">{deploymentHash}</code></p>
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
