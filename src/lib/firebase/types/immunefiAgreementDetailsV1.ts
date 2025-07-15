import type { BountyTerms } from "./agreementDetailsV1";

export interface ImmunefiAgreementDetailsV1 {
    name: string;
    contact: string;
    chains: Chain[];
    bountyTerms: BountyTerms;
}

export interface Chain {
    id: number;
    accounts: Account[];
}

export interface Account {
    name: string;
    address: string;
}