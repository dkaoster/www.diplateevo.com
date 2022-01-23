import { writable } from 'svelte/store';

// Get the locale out of storage on load.
const storedTheme = typeof localStorage === 'object' && localStorage.theme;

// Get a match media object
const matchMedia = typeof window === 'object'
  && window.matchMedia('(prefers-color-scheme: dark)');

// Set the stored value or a default.
export const theme = writable(
  storedTheme || ((matchMedia && matchMedia.matches) ? 'dark' : 'light'),
  (set) => {
    // Listen for prefers-color-scheme changes
    if (typeof window === 'object') {
      // The change listener
      const listener = (e) => set(e.matches ? 'dark' : 'light');

      // Adds the change listener
      matchMedia.addEventListener('change', listener);

      // Remove when we get unmounted
      return () => matchMedia.removeEventListener('change', listener);
    }

    // Return a blank function
    return () => {};
  },
);

// Anytime the store changes, update the local storage value.
theme.subscribe((value) => {
  if (typeof localStorage === 'object') localStorage.theme = value;
});
