declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	
	interface Window {
		ethereum?: {
			request: (args: { method: string; params?: any[] }) => Promise<any>;
			on: (event: string, callback: (...args: any[]) => void) => void;
			removeListener: (event: string, callback: (...args: any[]) => void) => void;
		};
	}
}

export default {
};
