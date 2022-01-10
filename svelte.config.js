import adapter from '@sveltejs/adapter-static';
import genImageSizes from 'rollup-generate-image-sizes';
import sveltePreprocess from 'svelte-preprocess';
import autoprefixer from 'autoprefixer';
import { svelte } from '@sveltejs/vite-plugin-svelte';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';

export default {
  kit: {
    adapter: adapter({
      // default options are shown
      pages: 'build',
      assets: 'build',
    }),
    trailingSlash: 'always',

    vite: () => ({
      plugins: [
        // Generates image sizes
        genImageSizes({
          hook: 'buildStart',
          dir: './static/images',
          inputFormat: ['jpg', 'jpeg', 'png', 'gif'],
          size: [1920, 768],
          outputFormat: ['jpg', 'webp'],
          forceUpscale: true,
        }),
      ],
    }),
  },

  preprocess: sveltePreprocess({
    sourceMap: dev,
    scss: { prependData: '@import \'src/base.scss\';' },
    postcss: { plugins: autoprefixer() },
    preserve: ['ld+json'],
  }),
};
