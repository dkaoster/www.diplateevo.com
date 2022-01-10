import adapter from '@sveltejs/adapter-static';
import genImageSizes from 'rollup-generate-image-sizes';
import sveltePreprocess from 'svelte-preprocess';
import autoprefixer from 'autoprefixer';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';

export default {
  kit: {
    adapter: adapter({
      // default options are shown
      pages: 'build',
      assets: 'build',
    }),
    trailingSlash: 'never',

    vite: () => ({
      plugins: [
        // Generates image sizes
        genImageSizes({
          hook: 'buildStart',
          dir: './static/images',
          inputFormat: ['jpg', 'jpeg', 'png', 'gif'],
          size: [1280, 768],
          outputFormat: ['jpg'],
          forceUpscale: true,
          skipExisting: dev,
          maxParallel: 4,
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
