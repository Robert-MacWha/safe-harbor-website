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

            // Parse all sections with error collection
            this.parseProtocolDetails(sections.protocolDetails || '', result);
            this.parseBountyTerms(sections.bountyTerms || '', result);
            this.parseContactDetails(sections.contactDetails || '', result);
            this.parseChainsAssets(sections.chainsAssets || '', result);
            this.parseAccounts(sections.accounts || '', result);

            // Basic validation
            if (!result.name) {
                errors.push('Protocol name is required');
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

        // Remove italic text first to avoid interference
        const cleanContent = this.removeItalicText(content);
        const lines = cleanContent.split('\n');

        // Find sections based on table headers or specific patterns
        let currentSection = '';
        let sectionContent: string[] = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            // Check for Protocol Name pattern (Protocol Details section)
            if (line.includes('Protocol Name:')) {
                if (currentSection) {
                    sections[currentSection] = sectionContent.join('\n');
                }
                currentSection = 'protocolDetails';
                sectionContent = [line];
                continue;
            }

            // Check for bounty terms patterns
            if (line.includes('Percentage:') || line.includes('Cap (USD):')) {
                if (currentSection !== 'bountyTerms') {
                    if (currentSection) {
                        sections[currentSection] = sectionContent.join('\n');
                    }
                    currentSection = 'bountyTerms';
                    sectionContent = [];
                }
                sectionContent.push(line);
                continue;
            }

            // Check for Contact table header
            if (line.includes('Name') && line.includes('Contact') && line.includes('|')) {
                if (currentSection) {
                    sections[currentSection] = sectionContent.join('\n');
                }
                currentSection = 'contactDetails';
                sectionContent = [line];
                continue;
            }

            // Check for Chain/Asset Recovery table header
            if (line.includes('Chain') && line.includes('Asset Recovery Address') && line.includes('|')) {
                if (currentSection) {
                    sections[currentSection] = sectionContent.join('\n');
                }
                currentSection = 'chainsAssets';
                sectionContent = [line];
                continue;
            }

            // Check for Accounts table header (looking for Chain, Name, Address pattern)
            if (line.includes('Chain') && line.includes('Name') && line.includes('Address') && line.includes('|')) {
                if (currentSection) {
                    sections[currentSection] = sectionContent.join('\n');
                }
                currentSection = 'accounts';
                sectionContent = [line];
                continue;
            }

            // Add line to current section if we're in one
            if (currentSection) {
                sectionContent.push(line);
            }
        }

        // Don't forget the last section
        if (currentSection) {
            sections[currentSection] = sectionContent.join('\n');
        }

        return sections;
    }

    private static parseProtocolDetails(content: string, result: AgreementDetailsV2): void {
        const protocolNameMatch = content.match(/Protocol Name:\s*(.+?)(?:\n|$)/i);
        if (protocolNameMatch) {
            const cleanName = this.cleanValue(protocolNameMatch[1]);
            result.name = cleanName || '';
        }

        // Owner address is handled separately in the form, not part of AgreementDetailsV2
    }

    private static parseBountyTerms(content: string, result: AgreementDetailsV2): void {
        // Parse numeric values with currency cleaning
        const percentage = this.extractNumericValue(content, /Percentage:\s*(.+?)(?:\n|$)/i);
        if (percentage !== null) result.bountyTerms.bountyPercentage = percentage;

        const cap = this.extractNumericValue(content, /Cap \(USD\):\s*(.+?)(?:\n|$)/i, true);
        if (cap !== null) result.bountyTerms.bountyCapUSD = cap;

        const aggregateCap = this.extractNumericValue(content, /Aggregate Cap \(USD\):\s*(.+?)(?:\n|$)/i, true);
        if (aggregateCap !== null) result.bountyTerms.aggregateBountyCapUSD = aggregateCap;

        // Parse boolean value
        const retainableValue = this.extractStringValue(content, /Retainable:\s*(.+?)(?:\n|$)/i);
        if (retainableValue) {
            result.bountyTerms.retainable = ['yes', 'true'].includes(retainableValue.toLowerCase());
        }

        // Parse identity
        const identity = this.extractStringValue(content, /Identity:\s*(.+?)(?:\n|$)/i);
        if (identity && this.isValidIdentity(identity)) {
            result.bountyTerms.identity = identity as IdentityRequirements;
        }

        // Parse diligence requirements
        const diligence = this.extractStringValue(content, /Diligence Requirements:\s*(.+?)(?:\n|$)/i);
        if (diligence) result.bountyTerms.diligenceRequirements = diligence;
    }

    private static parseContactDetails(content: string, result: AgreementDetailsV2): void {
        const table = this.parseTable(content);
        result.contact = table
            .filter(row => this.cleanValue(row[0] || '') && this.cleanValue(row[1] || ''))
            .map(row => ({
                name: this.cleanValue(row[0]),
                contact: this.cleanValue(row[1])
            }));
    }

    private static parseChainsAssets(content: string, result: AgreementDetailsV2): void {
        const table = this.parseTable(content);
        result.chains = table
            .filter(row => this.cleanValue(row[0] || '') && this.cleanValue(row[1] || ''))
            .map(row => ({
                caip2ChainId: this.cleanValue(row[0]),
                assetRecoveryAddress: this.cleanValue(row[1]),
                accounts: [] // Will be populated by parseAccounts
            }));
    }

    private static parseAccounts(content: string, result: AgreementDetailsV2): void {
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
                    const chain = result.chains.find(c => c.caip2ChainId === chainId);
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
                            caip2ChainId: chainId,
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
        const SCOPE_MAP: Record<string, ChildContractScope> = {
            'none': 'None',
            'existingonly': 'ExistingOnly',
            'futureonly': 'FutureOnly',
            'all': 'All'
        };

        const cleanValue = value.toLowerCase().replace(/[\[\]]/g, '');

        for (const [key, scope] of Object.entries(SCOPE_MAP)) {
            if (cleanValue.includes(key)) return scope;
        }

        return 'None'; // Default fallback
    }

    private static isValidIdentity(identity: string): boolean {
        const validIdentities: IdentityRequirements[] = ['Anonymous', 'Pseudonymous', 'Named'];
        return validIdentities.includes(identity as IdentityRequirements);
    }

    private static removeItalicText(content: string): string {
        // Remove lines containing italic formatting
        const ITALIC_REGEX = /(?<!\*)\*(?!\*).*?\*(?!\*)/; // *text* (not **text**)
        const BOLD_ITALIC_REGEX = /\*\*\*.*?\*\*\*/; // ***text***

        return content.split('\n').filter(line => {
            return !ITALIC_REGEX.test(line) && !BOLD_ITALIC_REGEX.test(line);
        }).join('\n');
    }

    private static extractStringValue(content: string, regex: RegExp): string | null {
        const match = content.match(regex);
        if (!match) return null;

        const cleaned = this.cleanValue(match[1]);
        return cleaned || null;
    }

    private static extractNumericValue(content: string, regex: RegExp, removeCurrency = false): number | null {
        const stringValue = this.extractStringValue(content, regex);
        if (!stringValue) return null;

        const cleanedValue = removeCurrency ? stringValue.replace(/[$,]/g, '') : stringValue;
        const number = parseFloat(cleanedValue);
        return isNaN(number) ? null : number;
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