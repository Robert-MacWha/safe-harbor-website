import { json } from '@sveltejs/kit';
import type { Protocol } from '$lib/firebase/types/protocol';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '$lib/firebase/firebase.js';
import type { SafeHarborAgreement } from '$lib/firebase/types/safeHarborAgreement';

async function getAgreementFirestore(slug: string): Promise<Protocol> {
    const snapshot = await getDoc(doc(db, 'protocols', slug));
    const protocol = snapshot.data() as Protocol;

    try {
        if (protocol.safeHarborAgreement?.path) {
            const safeHarborRef = doc(db, protocol.safeHarborAgreement.path);
            const safeHarborSnapshot = await getDoc(safeHarborRef);

            if (safeHarborSnapshot.exists()) {
                protocol.safeHarborContent = safeHarborSnapshot.data() as SafeHarborAgreement;
            }
        }
    } catch (error) {
        console.warn(`Error fetching SafeHarbourAgreement err=${error}`);
    }

    return protocol;
}

export async function GET({ params }) {
    const { slug } = params;
    const agreement = await getAgreementFirestore(slug);
    return json(agreement);
}
