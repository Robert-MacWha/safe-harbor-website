// src/routes/[slug]/+page.js

import type { Protocol } from "$lib/firebase/types/protocol";
import { error } from "@sveltejs/kit";

export async function load({ params, fetch }) {
    try {
        const response = await fetch(`/api/v1/agreements/${params.slug}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch data for slug: ${params.slug}`);
        }

        const protocol: Protocol = await response.json();
        return {
            protocol: protocol,
            slug: params.slug,
        };
    } catch (e) {
        throw error(404, `Could not find ${params.slug}`);
    }
}
