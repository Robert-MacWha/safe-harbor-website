import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export default {
	preprocess: [vitePreprocess()]
};
