import type { BountyTerms } from "./agreementDetailsV1";

export interface CantinaAgreementDetailsV1 {
    name: string;
    contact: string;
    cantinaUrl: string;
    recoveryAddresses: RecoveryAddress[];
    assets: Asset[];
    bountyTerms: BountyTerms;
}

export interface RecoveryAddress {
    name: string;
    address: string;
}

export interface Asset {
    name: string;
    description: string;
}
