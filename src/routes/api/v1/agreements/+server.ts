import { json } from '@sveltejs/kit';
import { db } from '$lib/firebase/firebase';
import { collection, getDoc, getDocs } from 'firebase/firestore';
import type { Protocol } from '$lib/firebase/types/protocol';
import type { SafeHarborAgreement } from '$lib/firebase/types/safeHarborAgreement';
import { doc } from 'firebase/firestore';

async function getProtocolsFirestore(): Promise<Protocol[]> {
    const snapshot = await getDocs(collection(db, 'protocols'));
    let protocols: Protocol[] = snapshot.docs.map((doc) => {
        return doc.data() as Protocol;
    });

    // Get safe harbor data for all agreements
    for (let i = 0; i < protocols.length; i++) {
        try {
            const protocol = protocols[i];

            if (protocol.safeHarborAgreement?.path) {
                const safeHarborRef = doc(db, protocol.safeHarborAgreement.path);
                const safeHarborSnapshot = await getDoc(safeHarborRef);

                if (safeHarborSnapshot.exists()) {
                    protocols[i].safeHarborContent = safeHarborSnapshot.data() as SafeHarborAgreement;
                }
            }
        } catch (error) {
            console.warn(`Error fetching SafeHarbourAgreement err=${error}`);
        }
    }

    protocols = protocols.filter((protocol) => protocol.safeHarborContent !== undefined);

    protocols = protocols.sort((a, b) => {
        return b.tvl - a.tvl;
    });

    return protocols;
}

export async function GET() {
    const protocols = await getProtocolsFirestore();
    return json(protocols);
}