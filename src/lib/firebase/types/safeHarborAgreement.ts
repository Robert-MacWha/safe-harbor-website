import type { AgreementDetailsV1 } from "./agreementDetailsV1";
import type { AgreementDetailsV2 } from "./agreementDetailsV2";
import type { ImmunefiAgreementDetailsV1 } from "./immunefiAgreementDetailsV1";
import type { CantinaAgreementDetailsV1 } from "./cantinaAgreementDetailsV1";

type SafeHarborVersion = 'seal-1' | 'seal-2' | 'immunefi-1' | 'cantina-1';

interface SafeHarborAgreementBase {
    adoptionProposalURI: string; // URL to the protocol's proposal of the adoption, or other confirmation of their adoption
    protocol: string; // Document path (was DocumentReference)
    version: SafeHarborVersion;
}

export interface SafeHarborAgreementV1 extends SafeHarborAgreementBase {
    agreementAddress: string; // Address of the agreement contract
    agreementDetails: AgreementDetailsV1;
    createdAt: number; // Epoch milliseconds (was Timestamp)
    creator: string; // creator EOA
    registryChainId: number; // evm chain ID
    registryTransaction: string; // evm txhash
    version: 'seal-1';
}

export interface SafeHarborAgreementV2 extends SafeHarborAgreementBase {
    agreementAddress: string; // Address of the agreement contract
    agreementDetails: AgreementDetailsV2;
    createdAt: number; // Epoch milliseconds (was Timestamp)
    creator: string; // creator EOA
    registryChainId: number; // evm chain ID
    registryTransaction: string; // evm txhash
    version: 'seal-2';
}

export interface SafeHarborAgreementImmunefiV1 extends SafeHarborAgreementBase {
    version: 'immunefi-1';
    agreementDetails: ImmunefiAgreementDetailsV1;
}

export interface SafeHarborAgreementCantinaV1 extends SafeHarborAgreementBase {
    version: 'cantina-1';
    agreementDetails: CantinaAgreementDetailsV1;
}

export type SafeHarborAgreement = SafeHarborAgreementV1 | SafeHarborAgreementV2 | SafeHarborAgreementImmunefiV1 | SafeHarborAgreementCantinaV1;