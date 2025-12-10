import { json, error } from '@sveltejs/kit';
import type { Protocol } from '$lib/firebase/types/protocol';
import { getDocument } from '$lib/firebase/firestore-rest';
import type { SafeHarborAgreement } from '$lib/firebase/types/safeHarborAgreement';

async function getAgreementFirestore(slug: string): Promise<Protocol | null> {
    const protocol = await getDocument<Protocol>(`protocols/${slug}`);

    if (!protocol) {
        return null;
    }

    try {
        if (protocol.safeHarborAgreement) {
            const safeHarborContent = await getDocument<SafeHarborAgreement>(
                protocol.safeHarborAgreement
            );

            if (safeHarborContent) {
                protocol.safeHarborContent = safeHarborContent;
            }
        }
    } catch (err) {
        console.warn(`Error fetching SafeHarbourAgreement err=${err}`);
    }

    return protocol;
}

export async function GET({ params }) {
    const { slug } = params;
    const agreement = await getAgreementFirestore(slug);

    if (!agreement) {
        throw error(404, `Protocol not found: ${slug}`);
    }

    return json(agreement);
}
