import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	preview: {
		port: 3005
	},
	plugins: [sveltekit()]
});
