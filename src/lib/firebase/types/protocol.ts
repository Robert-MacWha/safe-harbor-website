import type { SafeHarborAgreement } from "./safeHarborAgreement";

// Protocol collection
export interface Protocol {
    name: string;
    website: string;
    slug: string;
    icon: string;
    tvl: number;
    category: string;
    contactDetails: string;
    bugBounty?: string;

    safeHarborAgreement?: string; // Document path (was DocumentReference)
    safeHarborContent?: SafeHarborAgreement;
}