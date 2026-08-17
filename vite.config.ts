import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';

// base: './' is required — the app is served under /machine/{machineId}/
// on viamapplications.com, so all asset URLs must be relative.
export default defineConfig({
  base: './',
  plugins: [svelte(), tailwindcss()],
});
