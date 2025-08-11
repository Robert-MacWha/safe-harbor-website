import type { AgreementDetailsV2, ChildContractScope, IdentityRequirements } from '../firebase/types/agreementDetailsV2';
import { createDefaultAgreementDetails } from '../firebase/agreementDetailsV2Utils';

export interface ParseResult {
    success: boolean;
    data?: AgreementDetailsV2;
    errors: string[];
}

export class SafeHarborV2Parser {
    static parse(markdownContent: string): ParseResult {
        const errors: string[] = [];
        const result = createDefaultAgreementDetails();

        try {
            const sections = this.extractSections(markdownContent);

            // Parse Protocol Details
            if (sections.protocolDetails) {
                this.parseProtocolDetails(sections.protocolDetails, result, errors);
            }

            // Parse Bounty Terms
            if (sections.bountyTerms) {
                this.parseBountyTerms(sections.bountyTerms, result, errors);
            }

            // Parse Contact Details
            if (sections.contactDetails) {
                this.parseContactDetails(sections.contactDetails, result, errors);
            }

            // Parse Chains & Asset Recovery Addresses
            if (sections.chainsAssets) {
                this.parseChainsAssets(sections.chainsAssets, result, errors);
            }

            // Parse Accounts
            if (sections.accounts) {
                this.parseAccounts(sections.accounts, result, errors);
            }

            return {
                success: errors.length === 0,
                data: result,
                errors
            };
        } catch (error) {
            return {
                success: false,
                errors: [`Parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`]
            };
        }
    }

    private static extractSections(content: string): Record<string, string> {
        const sections: Record<string, string> = {};

        // Split content by bold headers
        const headerRegex = /\*\*(.*?)\*\*/g;
        const parts = content.split(headerRegex);

        for (let i = 1; i < parts.length; i += 2) {
            const header = parts[i].trim().toLowerCase();
            const content = parts[i + 1] || '';

            if (header.includes('protocol details')) {
                sections.protocolDetails = content;
            } else if (header.includes('bounty terms')) {
                sections.bountyTerms = content;
            } else if (header.includes('contact details')) {
                sections.contactDetails = content;
            } else if (header.includes('chains') && header.includes('asset')) {
                sections.chainsAssets = content;
            } else if (header.includes('accounts')) {
                sections.accounts = content;
            }
        }

        return sections;
    }

    private static parseProtocolDetails(content: string, result: AgreementDetailsV2, errors: string[]): void {
        const protocolNameMatch = content.match(/Protocol Name:\s*(.+?)(?:\n|$)/i);
        if (protocolNameMatch) {
            const cleanName = this.cleanValue(protocolNameMatch[1]);
            result.name = cleanName || '';
        }

        // Owner address is handled separately in the form, not part of AgreementDetailsV2
    }

    private static parseBountyTerms(content: string, result: AgreementDetailsV2, errors: string[]): void {
        const percentageMatch = content.match(/Percentage:\s*(.+?)(?:\n|$)/i);
        if (percentageMatch) {
            const cleanValue = this.cleanValue(percentageMatch[1]);
            if (cleanValue) {
                const percentage = parseFloat(cleanValue);
                if (!isNaN(percentage)) {
                    result.bountyTerms.bountyPercentage = percentage;
                }
            }
        }

        const capMatch = content.match(/Cap \(USD\):\s*(.+?)(?:\n|$)/i);
        if (capMatch) {
            const cleanValue = this.cleanValue(capMatch[1]);
            if (cleanValue) {
                const cap = parseFloat(cleanValue.replace(/[$,]/g, ''));
                if (!isNaN(cap)) {
                    result.bountyTerms.bountyCapUSD = cap;
                }
            }
        }

        const aggregateCapMatch = content.match(/Aggregate Cap \(USD\):\s*(.+?)(?:\n|$)/i);
        if (aggregateCapMatch) {
            const cleanValue = this.cleanValue(aggregateCapMatch[1]);
            if (cleanValue) {
                const aggregateCap = parseFloat(cleanValue.replace(/[$,]/g, ''));
                if (!isNaN(aggregateCap)) {
                    result.bountyTerms.aggregateBountyCapUSD = aggregateCap;
                }
            }
        }

        const retainableMatch = content.match(/Retainable:\s*(.+?)(?:\n|$)/i);
        if (retainableMatch) {
            const cleanValue = this.cleanValue(retainableMatch[1]);
            if (cleanValue) {
                const retainable = cleanValue.toLowerCase();
                result.bountyTerms.retainable = retainable === 'yes' || retainable === 'true';
            }
        }

        const identityMatch = content.match(/Identity:\s*(.+?)(?:\n|$)/i);
        if (identityMatch) {
            const cleanValue = this.cleanValue(identityMatch[1]);
            if (cleanValue && this.isValidIdentity(cleanValue)) {
                result.bountyTerms.identity = cleanValue as IdentityRequirements;
            }
        }

        const diligenceMatch = content.match(/Diligence Requirements:\s*(.+?)(?:\n|$)/i);
        if (diligenceMatch) {
            const cleanValue = this.cleanValue(diligenceMatch[1]);
            if (cleanValue) {
                result.bountyTerms.diligenceRequirements = cleanValue;
            }
        }
    }

    private static parseContactDetails(content: string, result: AgreementDetailsV2, errors: string[]): void {
        const table = this.parseTable(content);
        if (table.length > 0) {
            result.contact = table
                .filter(row => {
                    const name = this.cleanValue(row[0] || '');
                    const contact = this.cleanValue(row[1] || '');
                    return name && contact;
                })
                .map(row => ({
                    name: this.cleanValue(row[0]),
                    contact: this.cleanValue(row[1])
                }));
        }
    }

    private static parseChainsAssets(content: string, result: AgreementDetailsV2, errors: string[]): void {
        const table = this.parseTable(content);
        if (table.length > 0) {
            // Reset chains array to avoid duplicates
            result.chains = [];

            table
                .filter(row => {
                    const chainId = this.cleanValue(row[0] || '');
                    const recoveryAddress = this.cleanValue(row[1] || '');
                    return chainId && recoveryAddress;
                })
                .forEach(row => {
                    result.chains.push({
                        id: this.cleanValue(row[0]),
                        assetRecoveryAddress: this.cleanValue(row[1]),
                        accounts: [] // Will be populated by parseAccounts
                    });
                });
        }
    }

    private static parseAccounts(content: string, result: AgreementDetailsV2, errors: string[]): void {
        const table = this.parseTable(content);
        if (table.length > 0) {
            table
                .filter(row => {
                    const chainId = this.cleanValue(row[0] || '');
                    const address = this.cleanValue(row[2] || '');
                    return chainId && address;
                })
                .forEach(row => {
                    const chainId = this.cleanValue(row[0]);
                    const accountName = this.cleanValue(row[1] || '');
                    const address = this.cleanValue(row[2]);
                    const childScope = row.length >= 4 ? this.parseChildContractScope(this.cleanValue(row[3] || '')) : 'None';

                    // Find the matching chain
                    const chain = result.chains.find(c => c.id === chainId);
                    if (chain) {
                        chain.accounts.push({
                            name: accountName,
                            address: address,
                            childContractScope: childScope,
                            children: []
                        });
                    } else {
                        // Create chain if it doesn't exist
                        result.chains.push({
                            id: chainId,
                            assetRecoveryAddress: '', // Will need to be filled manually
                            accounts: [{
                                name: accountName,
                                address: address,
                                childContractScope: childScope,
                                children: []
                            }]
                        });
                    }
                });
        }
    }

    private static parseTable(content: string): string[][] {
        const lines = content.split('\n').map(line => line.trim());
        const tableRows: string[][] = [];
        let foundFirstRow = false;

        for (const line of lines) {
            if (line.includes('|') && !line.includes('---')) {
                const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell !== '');
                if (cells.length > 0) {
                    // Skip the first row (header)
                    if (!foundFirstRow) {
                        foundFirstRow = true;
                        continue;
                    }
                    tableRows.push(cells);
                }
            }
        }

        return tableRows;
    }

    private static parseChildContractScope(value: string): ChildContractScope {
        const cleanValue = value.toLowerCase().replace(/[\[\]]/g, '');

        if (cleanValue.includes('none')) return 'None';
        if (cleanValue.includes('existingonly')) return 'ExistingOnly';
        if (cleanValue.includes('futureonly')) return 'FutureOnly';
        if (cleanValue.includes('all')) return 'All';

        return 'None'; // Default fallback
    }

    private static isValidIdentity(identity: string): boolean {
        const validIdentities: IdentityRequirements[] = ['Anonymous', 'Pseudonymous', 'Named'];
        return validIdentities.includes(identity as IdentityRequirements);
    }

    private static cleanValue(value: string): string {
        const cleaned = value.trim();
        // If the value is just brackets with placeholder text, return empty string
        if (cleaned.match(/^\[.*\]$/) || cleaned === '') {
            return '';
        }
        return cleaned;
    }
}