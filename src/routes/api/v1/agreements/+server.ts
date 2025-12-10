import { json } from '@sveltejs/kit';
import { listDocuments, getDocument } from '$lib/firebase/firestore-rest';
import type { Protocol } from '$lib/firebase/types/protocol';
import type { SafeHarborAgreement } from '$lib/firebase/types/safeHarborAgreement';

async function getProtocolsFirestore(): Promise<Protocol[]> {
    const protocols = await listDocuments<Protocol>('protocols');

    // Fetch all SafeHarbor agreements in parallel
    await Promise.all(
        protocols.map(async (protocol) => {
            try {
                if (protocol.safeHarborAgreement) {
                    const safeHarborContent = await getDocument<SafeHarborAgreement>(
                        protocol.safeHarborAgreement
                    );
                    if (safeHarborContent) {
                        protocol.safeHarborContent = safeHarborContent;
                    }
                }
            } catch (error) {
                console.warn(`Error fetching SafeHarbourAgreement err=${error}`);
            }
        })
    );

    // Filter out invalid/empty protocols and sort by TVL descending
    return protocols
        .filter((p) => p.name && p.slug)
        .sort((a, b) => (b.tvl ?? 0) - (a.tvl ?? 0));
}

export async function GET() {
    const protocols = await getProtocolsFirestore();
    return json(protocols);
}