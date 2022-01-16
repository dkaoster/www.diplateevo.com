import adapter from '@sveltejs/adapter-static';
import genImageSizes from 'rollup-plugin-generate-image-sizes';
import sveltePreprocess from 'svelte-preprocess';
import autoprefixer from 'autoprefixer';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';

// Export this result as a constant to be used below as a dev
// plugin but also in genImageSizes.js
export const genImageSizePlugin = genImageSizes({
  hook: 'buildStart',
  dir: './static/images',
  inputFormat: ['jpg', 'jpeg', 'png', 'gif'],
  size: [1280, 768],
  outputFormat: ['jpg'],
  forceUpscale: true,
  maxParallel: 8,
});

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
        // Generates image sizes, but only on dev. production mode
        // simply uses a prebuild script to handle this.
        dev && { ...genImageSizePlugin, load: genImageSizePlugin.buildStart },
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
