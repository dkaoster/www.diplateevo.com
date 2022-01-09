import { readable } from 'svelte/store';

// Supported locales
export const supportedLocales = ['en', 'zh'];
export const defaultLocale = 'en';

/**
 * Takes a locale string and returns only the language subtag if it is
 * a supported language.
 *
 * @param localeString
 * @returns {string|null}
 */
const isSupportedLocale = (localeString) => {
  // If this localeString isn't even a string, we just return null
  if (typeof localeString !== 'string') return null;

  // Only get the first part of the locale language, we don't care about region
  const languageSubtag = localeString.split('-')[0].toLowerCase();

  // If this language is supported, we use it
  if (supportedLocales.indexOf(languageSubtag) >= 0) return languageSubtag;

  return null;
};

/**
 * Generates a readable store that contains an object. On initialization,
 * this store will first see if we have stored a locale into localeStorage,
 * then try the navigator locales, otherwise it will fallback to defaultLocale.
 *
 * {
 *   locale: (string) The current locale of the page.
 *   setLocale: (function) A function to update the locale.
 * }
 *
 * @type {Readable<null>}
 */
export const locale = readable(null, (set) => {
  // A function to update the locale
  const setLocale = (newLocale) => {
    // Make sure the locale is one that we support
    const languageSubtag = isSupportedLocale(newLocale) || defaultLocale;

    // Save it to localStorage
    if (typeof localStorage === 'object') localStorage.locale = languageSubtag;

    // Set it on this store
    set({ locale: languageSubtag, setLocale });
  };

  // Get the locale out of storage on load.
  const storedLocale = typeof localStorage === 'object' && localStorage.locale;

  // Get the locale out of the browser
  const navigatorLocale = (typeof window === 'object')
    && (window.navigator.language || window.navigator.languages.find(isSupportedLocale));

  // Set the default locale on load
  setLocale(storedLocale || navigatorLocale || defaultLocale);
});
