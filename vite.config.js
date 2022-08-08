import { sveltekit } from '@sveltejs/kit/vite';
import { genImageSizePlugin } from './svelte.config.js';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';

export default {
  plugins: [
    sveltekit(),
    // Generates image sizes, but only on dev. production mode
    // simply uses a prebuild script to handle this.
    dev && genImageSizePlugin,
  ],
  server: {
    port: 3000,
  },
};
