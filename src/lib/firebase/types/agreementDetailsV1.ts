export interface AgreementDetailsV1 {
    name: string;
    contact: string;
    chains: Chain[];
    bountyTerms: BountyTerms;
    agreementURI: string;
}

export interface Chain {
    id: number;
    assetRecoveryAddress: string;
    accounts: Account[];
}

export interface Account {
    name: string;
    address: string;
    childContractScope: string;
    signature: string;

    children: Array<{
        name: string;
        address: string;
    }>;
}

export interface BountyTerms {
    bountyCapUSD: number;
    bountyPercentage: number;
    diligenceRequirements: string;
    identity: string;
    retainable: boolean;
}
