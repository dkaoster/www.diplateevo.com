import adapter from '@sveltejs/adapter-static';
import { generateImageSizes } from 'rollup-plugin-generate-image-sizes';
import sveltePreprocess from 'svelte-preprocess';
import autoprefixer from 'autoprefixer';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';

// Export this result as a constant to be used below as a dev
// plugin but also in genImageSizes.js
export const genImageSizePlugin = generateImageSizes({
  hook: 'buildStart',
  dir: './static/images',
  inputFormat: ['jpg', 'jpeg', 'png', 'gif'],
  size: [1920, 1280, 768],
  outputFormat: 'match',
  forceUpscale: false,
  maxParallel: 8,
  outputManifest: './content/images-manifest.json',
});

// Don't run generateImageSizes too often
let lastImageGenTime = (new Date()).getTime();

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
        dev && {
          ...genImageSizePlugin,
          load: () => {
            // Run at most once every 15 seconds, totally a hack lol
            if ((new Date()).getTime() > (new Date(lastImageGenTime + 15000))) {
              genImageSizePlugin.buildStart();
              lastImageGenTime = (new Date()).getTime();
            }
          },
        },
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
