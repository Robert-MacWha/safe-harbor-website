<script lang="ts">
    import type { AgreementDetailsV2 } from "$lib/firebase/types/agreementDetailsV2";
    import {
        createDefaultAgreementDetails,
        createDefaultChain,
        createDefaultAccount,
        createDefaultContact,
        generateAgreementJSON,
        generateAgreementTuple,
    } from "$lib/firebase/agreementDetailsV2Utils";
    import { connectWallet, deployAgreement } from "$lib/contracts/factory";
    import type { Address } from "viem";
    import type { WalletState } from "@web3-onboard/core";
    import { SafeHarborV2Parser } from "$lib/parser/SafeHarborV2Parser";

    // Form state
    let agreementDetails: AgreementDetailsV2 = $state(createDefaultAgreementDetails());
    let ownerAddress = $state<Address | undefined>(undefined);

    // Output state
    let output = $state("");
    let outputType = $state<"json" | "tuple" | "">("");

    // Wallet state
    let wallet = $state<WalletState | null>(null);
    let isConnecting = $state(false);
    let isDeploying = $state(false);
    let deploymentHash = $state<string | null>(null);
    let deploymentError = $state<string | null>(null);
    let walletError = $state<string | null>(null);

    // Import state
    let showImportModal = $state(false);
    let importText = $state("");
    let importError = $state<string | null>(null);

    let formElement: HTMLFormElement;

    let customErrors = $state({
        retainable: "",
        cap: "",
        owner: "",
    });

    function openImportModal() {
        showImportModal = true;
        importText = "";
        importError = null;
    }

    function closeImportModal() {
        showImportModal = false;
        importText = "";
        importError = null;
    }

    function handleImport() {
        importError = null;

        if (!importText.trim()) {
            importError = "Please paste your document content";
            return;
        }

        const parseResult = SafeHarborV2Parser.parse(importText);

        if (parseResult.success && parseResult.data) {
            agreementDetails = parseResult.data;
            closeImportModal();

            // Reset form validation state
            if (formElement) {
                formElement.classList.remove("was-validated");
            }
            customErrors = { retainable: "", cap: "", owner: "" };
        } else {
            importError = parseResult.errors.join(", ") || "Failed to parse document";
        }
    }

    async function handleFormSubmit(event: SubmitEvent) {
        event.preventDefault();

        formElement.classList.add("was-validated");
        const formValid = validateCustomRules();
        if (!formElement.checkValidity() || !formValid) {
            return;
        }

        const submitter = event.submitter as HTMLButtonElement;
        const action = submitter?.dataset.action;

        switch (action) {
            case "json":
                handleGenerateJSON();
                break;
            case "tuple":
                handleGenerateTuple();
                break;
            case "deploy":
                await handleDeployContract();
                break;
        }
    }

    function handleGenerateJSON() {
        output = generateAgreementJSON(agreementDetails);
        outputType = "json";
    }

    function handleGenerateTuple() {
        output = generateAgreementTuple(agreementDetails);
        outputType = "tuple";
    }

    async function handleConnectWallet() {
        isConnecting = true;
        walletError = null;
        try {
            wallet = await connectWallet();
        } catch (error: any) {
            walletError = error.message;
        } finally {
            isConnecting = false;
        }
    }

    async function handleDeployContract() {
        isDeploying = true;
        deploymentHash = null;
        deploymentError = null;

        if (!wallet) {
            walletError = "Please connect your wallet first.";
            isDeploying = false;
            return;
        }

        try {
            const result = await deployAgreement(wallet, agreementDetails, ownerAddress);
            deploymentHash = result.hash;
        } catch (error: any) {
            deploymentError = error.message;
        } finally {
            isDeploying = false;
        }
    }

    function validateCustomRules(): boolean {
        customErrors.retainable = "";
        customErrors.cap = "";

        const maxCap = agreementDetails.bountyTerms.aggregateBountyCapUSD;
        const cap = agreementDetails.bountyTerms.bountyCapUSD;
        const retainable = agreementDetails.bountyTerms.retainable;

        let isValid = true;

        if (maxCap && maxCap > 0) {
            if (retainable) {
                console.warn("Retainable is set to 'Yes' but Max Cap is defined.");
                customErrors.retainable = "When Max Cap is set, Retainable must be 'No'.";
                isValid = false;
            }
            if (cap && cap > maxCap) {
                console.warn("Cap is greater than or equal to Max Cap.");
                customErrors.cap = "Cap must be less than Max Cap.";
                isValid = false;
            }
        }

        if (ownerAddress && !/^0x[a-fA-F0-9]{40}$/.test(ownerAddress)) {
            console.warn("Invalid owner address format.");
            customErrors.owner = "Owner address must be a valid Ethereum address (0x followed by 40 hex characters).";
            isValid = false;
        }

        return isValid;
    }

    function addChain(e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        agreementDetails.chains = [...agreementDetails.chains, createDefaultChain()];
    }

    function removeChain(index: number) {
        if (agreementDetails.chains.length <= 1) return;
        agreementDetails.chains = agreementDetails.chains.filter((_, i) => i !== index);
    }

    function addAccount(e: MouseEvent, chainIndex: number) {
        e.preventDefault();
        e.stopPropagation();
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

    function addContact(e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
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

<div class="pt-4 mt-2"></div>

<div class="hero mt-6 mb-4 py-5">
    <div class="container d-flex flex-column align-items-center text-center">
        <h2 class="mb-4">Safe Harbor Adoption Generator</h2>
    </div>
</div>

<div class="container mb-5">
    <p class="mb-0">
        This tool facilitates adoption of the <strong>SEAL Whitehat Safe Harbor Agreement</strong> by generating the
        required configuration and providing flexible deployment options. You can deploy your adoption directly on-chain
        through this interface, or generate structured tuple/JSON output for subsequent deployment using Foundry scripts
        or alternative deployment frameworks. For comprehensive guidance, please follow the
        <a
            href="https://frameworks.securityalliance.org/safe-harbor/self-adoption-guide.html"
            target="_blank"
            rel="noopener noreferrer">self-adoption guide</a
        >.
    </p>
    <div class="text-center">
        <button type="button" class="btn btn-outline-primary" onclick={openImportModal}> Import from Document </button>
    </div>
</div>

<div class="info container p-4 mb-6 rounded">
    <form bind:this={formElement} onsubmit={handleFormSubmit} novalidate>
        <!-- Protocol Details -->
        <div class="row mb-4">
            <div class="col-12">
                <h4 class="mb-4">Protocol Details</h4>
                <div class="row">
                    <div class="col-12 col-md-6">
                        <label for="protocolName" class="form-label">Protocol Name</label>
                        <input
                            type="text"
                            class="form-control font-monospace"
                            id="protocolName"
                            bind:value={agreementDetails.name}
                            placeholder="Enter protocol name"
                            required
                            minlength="1"
                            maxlength="100"
                        />
                    </div>
                    <div class="col-12 col-md-6">
                        <label for="ownerAddress" class="form-label">Owner Address</label>
                        <input
                            type="text"
                            class="form-control font-monospace"
                            id="ownerAddress"
                            bind:value={ownerAddress}
                            placeholder="0x... (optional)"
                            title="Must be a valid Ethereum address (0x followed by 40 hex characters) or empty"
                        />
                        {#if customErrors.owner}
                            <div class="invalid-feedback d-block">{customErrors.owner}</div>
                        {/if}
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
                    <label for="bountyPercentage" class="form-label">Percentage</label>
                    <div class="input-group">
                        <input
                            type="number"
                            class="form-control no-spinner font-monospace"
                            id="bountyPercentage"
                            bind:value={agreementDetails.bountyTerms.bountyPercentage}
                            min="0"
                            max="100"
                            step="0.1"
                            required
                        />
                        <span class="input-group-text">%</span>
                    </div>
                </div>
                <div class="col mb-3" style="min-width: 20ch;">
                    <label for="bountyCap" class="form-label">Cap (USD)</label>
                    <div class="input-group">
                        <span class="input-group-text">$</span>
                        <input
                            type="number"
                            class="form-control no-spinner font-monospace {customErrors.cap ? 'is-invalid' : ''}"
                            id="bountyCap"
                            bind:value={agreementDetails.bountyTerms.bountyCapUSD}
                            min="0"
                            required
                        />
                        {#if customErrors.cap}
                            <div class="invalid-feedback d-block">{customErrors.cap}</div>
                        {/if}
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
                        class="form-select font-monospace {customErrors.retainable ? 'is-invalid' : ''}"
                        id="retainable"
                        bind:value={agreementDetails.bountyTerms.retainable}
                    >
                        <option value={false}>No</option>
                        <option value={true}>Yes</option>
                    </select>
                    {#if customErrors.retainable}
                        <div class="invalid-feedback d-block">{customErrors.retainable}</div>
                    {/if}
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
                            <th scope="col">Name</th>
                            <th scope="col">Contact Information</th>
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
                                        minlength="1"
                                        maxlength="100"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        class="form-control form-control-sm font-monospace"
                                        bind:value={contact.contact}
                                        placeholder="email@example.com or @username"
                                        required
                                        minlength="1"
                                        maxlength="200"
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
                                <label for="recoveryAddress{chainIndex}" class="form-label"
                                    >Asset Recovery Address</label
                                >
                                <input
                                    type="text"
                                    class="form-control font-monospace"
                                    id="recoveryAddress{chainIndex}"
                                    bind:value={chain.assetRecoveryAddress}
                                    placeholder="0x..."
                                    style="min-width: 0;"
                                    required
                                    title="Must be a valid address for the asset on this caip-2 chain"
                                />
                            </div>
                            <div class="flex-shrink-0" style="min-width: 200px; max-width: 20ch;">
                                <label for="chainId{chainIndex}" class="form-label">Chain ID</label>
                                <input
                                    type="text"
                                    class="form-control font-monospace"
                                    id="chainId{chainIndex}"
                                    bind:value={chain.id}
                                    placeholder="eip155:1"
                                    style="width: 100%;"
                                    required
                                    pattern="^[a-zA-Z0-9]+:[a-zA-Z0-9]+$"
                                    title="Must be a valid CAIP-2 chain ID (e.g., eip155:1)"
                                />
                                <div class="invalid-feedback">
                                    Please provide a valid CAIP-2 chain ID (e.g., eip155:1).
                                </div>
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
                                            <th scope="col">Address</th>
                                            <th scope="col">Child Scope</th>
                                            <th scope="col">
                                                <div class="text-center">
                                                    <button
                                                        type="button"
                                                        class="btn-material"
                                                        onclick={(e) => addAccount(e, chainIndex)}
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
                                                        title="Must be a valid address for the asset on this caip-2 chain"
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

        <!-- Generate Output Section -->
        <div class="generate-output py-3">
            <h4 class="mb-4">Generate Output & Deploy</h4>

            <div class="row g-3 mb-4">
                <div class="col-6 col-md-4">
                    <button type="submit" class="btn btn-primary w-100" data-action="json"> Generate JSON </button>
                </div>
                <div class="col-6 col-md-4">
                    <button type="submit" class="btn btn-primary w-100" data-action="tuple"> Generate Tuple </button>
                </div>
                <div class="col-12 col-md-4">
                    {#if !wallet}
                        <button
                            type="button"
                            class="btn btn-primary w-100"
                            onclick={handleConnectWallet}
                            disabled={isConnecting}
                        >
                            {isConnecting ? "Connecting..." : "Connect Wallet"}
                        </button>
                    {:else}
                        <button type="submit" class="btn btn-primary w-100" data-action="deploy" disabled={isDeploying}>
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
    </form>
</div>

<!-- Import Modal -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
{#if showImportModal}
    <div
        class="modal fade show d-block"
        tabindex="-1"
        aria-labelledby="import-modal-title"
        aria-modal="true"
        role="dialog"
    >
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="import-modal-title">Import from Document</h1>
                    <button type="button" class="btn-close" onclick={closeImportModal} aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p class="text-muted mb-3">
                        Copy the "Adoption Details" section from your adoption document as <strong>markdown</strong> and
                        paste it below. Make sure to copy as markdown format (not plain text) for the parser to work correctly.
                    </p>
                    <div class="mb-3">
                        <label for="importTextarea" class="form-label">Document Content (Markdown)</label>
                        <textarea
                            id="importTextarea"
                            class="form-control font-monospace"
                            rows="15"
                            bind:value={importText}
                            placeholder="Paste your markdown content here..."
                        ></textarea>
                    </div>
                    {#if importError}
                        <div class="alert alert-danger">
                            {importError}
                        </div>
                    {/if}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick={closeImportModal}>Cancel</button>
                    <button type="button" class="btn btn-primary" onclick={handleImport}>Import</button>
                </div>
            </div>
        </div>
    </div>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div class="modal-backdrop fade show" onclick={closeImportModal}></div>
{/if}

<style>
    .hero {
        background-color: var(--accent-light);
    }
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
