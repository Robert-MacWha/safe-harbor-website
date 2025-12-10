import { json } from '@sveltejs/kit';
import { listDocuments, getDocument } from '$lib/firebase/firestore-rest';
import type { Protocol } from '$lib/firebase/types/protocol';
import type { SafeHarborAgreement } from '$lib/firebase/types/safeHarborAgreement';

async function getProtocolsFirestore(): Promise<Protocol[]> {
    let protocols = await listDocuments<Protocol>('protocols');

    // Get safe harbor data for all agreements
    for (let i = 0; i < protocols.length; i++) {
        try {
            const protocol = protocols[i];

            if (protocol.safeHarborAgreement) {
                const safeHarborContent = await getDocument<SafeHarborAgreement>(
                    protocol.safeHarborAgreement
                );

                if (safeHarborContent) {
                    protocols[i].safeHarborContent = safeHarborContent;
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