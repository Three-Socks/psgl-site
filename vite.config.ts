import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	build: {
		// Keep output lean for static hosting
		minify: 'esbuild',
		cssMinify: true,
		target: 'baseline-widely-available',
		sourcemap: false
	}
});
