import { resolve } from "$app/paths";
import type { Protocol } from "$lib/firebase/types/protocol";

const SITE = "https://securityalliance.org/safe-harbor";

export const GET = async ({ fetch }: { fetch: typeof globalThis.fetch }) => {
	const response = await fetch(resolve('/api/v1/agreements'));
	const protocols = await response.json();

	let pages = [
		{ url: '', priority: 1.0, changefreq: 'weekly' },
		{ url: '/about', priority: 0.8, changefreq: 'monthly' },
		{ url: '/whitehats', priority: 0.7, changefreq: 'weekly' },
		{ url: '/adoption', priority: 0.6, changefreq: 'monthly' }
	];

	protocols.forEach((protocol: Protocol) => {
		pages.push({
			url: `/database/${protocol.slug}`,
			priority: 0.7,
			changefreq: 'monthly'
		});
	});

	let urlEntries = pages.map(page => `
	<url>
		<loc>${SITE}${page.url}</loc>
		<changefreq>${page.changefreq}</changefreq>
		<priority>${page.priority}</priority>
	</url>`
	).join('');

	return new Response(
		`
		<?xml version="1.0" encoding="UTF-8" ?>
		<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
		${urlEntries}
		</urlset>`.trim(),
		{
			headers: {
				'Content-Type': 'application/xml'
			}
		}
	);
}

