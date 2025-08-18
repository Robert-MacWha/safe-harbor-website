export type ChildContractScope = "None" | "ExistingOnly" | "FutureOnly" | "All";
export type IdentityRequirements = "Anonymous" | "Pseudonymous" | "Named";

export interface AgreementDetailsV2 {
    name: string;
    contact: Contact[];
    chains: Chain[];
    bountyTerms: BountyTerms;
    agreementURI: string;
}

export interface Chain {
    caip2ChainId: string;
    assetRecoveryAddress: string;
    accounts: Account[];
}

export interface Account {
    name: string;
    address: string;
    childContractScope: ChildContractScope;

    children: Array<{
        name: string;
        address: string;
    }>;
}

export interface BountyTerms {
    bountyCapUSD: number;
    bountyPercentage: number;
    diligenceRequirements: string;
    identity: IdentityRequirements;
    retainable: boolean;
    aggregateBountyCapUSD: number;
}

export interface Contact {
    name: string;
    contact: string;
}