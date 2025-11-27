<script lang="ts">
    interface Props {
        rescue: {
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
        };
        rescueId: string;
    }

    let { rescue, rescueId }: Props = $props();
</script>

<tr class="child-of-{rescueId}" style="display: none;">
    <td colspan="6" class="p-3">
        {#if rescue.report}
            <div class="section mb-3">
                <h6 class="fw-semibold mb-2">Report</h6>
                <div class="report-link">
                    <a
                        href={rescue.report}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="transaction-link"
                    >
                        View Full Report
                    </a>
                </div>
            </div>
        {/if}

        {#if rescue.note}
            <div class="section mb-3">
                <h6 class="fw-semibold mb-2">Note</h6>
                <p class="mb-0 text-left">{rescue.note}</p>
            </div>
        {/if}

        {#if rescue.value_tokens && rescue.value_tokens.length > 0}
            <div class="section mb-3">
                <h6 class="fw-semibold mb-2">Token Values</h6>
                {#each rescue.value_tokens as tokenObj}
                    {#each Object.entries(tokenObj) as [token, amount]}
                        <div class="token-item d-flex align-items-center mb-1">
                            <span class="token-symbol me-2 fw-medium"
                                >{token}:</span
                            >
                            <span class="token-amount">{amount}</span>
                        </div>
                    {/each}
                {/each}
            </div>
        {/if}

        {#if rescue.whitehat_transactions && rescue.whitehat_transactions.length > 0}
            <div class="section mb-3">
                <h6 class="fw-semibold mb-2">Whitehat Transactions</h6>
                {#each rescue.whitehat_transactions as tx}
                    <div class="transaction-item mb-1">
                        <a
                            href={tx}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="transaction-link"
                        >
                            {tx.split("/").pop()}
                        </a>
                    </div>
                {/each}
            </div>
        {/if}

        {#if rescue.recovery_transactions && rescue.recovery_transactions.length > 0}
            <div class="section mb-3">
                <h6 class="fw-semibold mb-2">Recovery Transactions</h6>
                {#each rescue.recovery_transactions as tx}
                    <div class="transaction-item mb-1">
                        <a
                            href={tx}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="transaction-link"
                        >
                            {tx.split("/").pop()}
                        </a>
                    </div>
                {/each}
            </div>
        {/if}
    </td>
</tr>

<style>
    .section {
        border-bottom: 1px solid var(--accent-light);
        padding-bottom: 0.75rem;
    }

    .section:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
    }

    h6 {
        color: var(--text-primary);
        font-size: 0.9rem;
    }

    .token-item {
        font-size: 0.85rem;
    }

    .token-symbol {
        color: var(--text-primary);
        min-width: 60px;
    }

    .token-amount {
        color: var(--text-secondary);
        font-family: monospace;
    }

    .transaction-link {
        color: var(--accent-primary);
        text-decoration: none;
        font-family: monospace;
        font-size: 0.85rem;
        word-break: break-all;
    }

    .transaction-link:hover {
        text-decoration: underline;
    }

    td {
        background-color: var(--bg-secondary) !important;
    }

    .section p {
        white-space: normal;
        overflow-wrap: anywhere;
        word-break: break-word;
    }
</style>
