import { genImageSizePlugin } from './svelte.config.js';

// This script is run as a prebuild step, because adapter-static does not
// properly update the static files if I manipulate them via a rollup
// plugin. Hopefully in the future there is a better way of dealing
// with this scenario.
genImageSizePlugin.buildStart();
