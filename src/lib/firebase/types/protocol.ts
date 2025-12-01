import type firebase from "firebase/compat/app";
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

    safeHarborAgreement?: firebase.firestore.DocumentReference;
    safeHarborContent: SafeHarborAgreement;
}