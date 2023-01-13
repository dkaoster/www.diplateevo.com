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
  size: [1920, 1280, 768, 640],
  outputFormat: 'match',
  forceUpscale: false,
  quality: 75,
  maxParallel: 8,
  outputManifest: './content/images-manifest.json',
});

export default {
  kit: {
    adapter: adapter({
      // default options are shown
      pages: 'build',
      assets: 'build',
    }),
  },

  preprocess: sveltePreprocess({
    sourceMap: dev,
    scss: { prependData: '@import \'src/base.scss\';' },
    postcss: { plugins: autoprefixer() },
    preserve: ['ld+json'],
  }),
};
