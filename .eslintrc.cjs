module.exports = {
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  env: {
    es6: true,
    browser: true,
  },
  plugins: [
    'svelte',
  ],
  overrides: [
    {
      files: ['**/*.svelte'],
      parser: 'svelte-eslint-parser',
    },
  ],
  extends: ['eslint-config-airbnb-base'],
  rules: {
    'import/no-extraneous-dependencies': 0,
    'import/no-mutable-exports': 0,
    'import/prefer-default-export': 0,
    'import/no-unresolved': 0,
    'import/extensions': 0,
    'import/first': 0,
    camelcase: 0,
  },
  settings: {
    'svelte3/ignore-styles': (attr) => !!attr.lang,
    'svelte3/named-blocks': false,
  },
};
