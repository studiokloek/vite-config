// Some settings automatically inherited from .editorconfig

const config = {
  // Trailing commas help with git merging and conflict resolution
  trailingComma: 'all',

  semi: true,
  singleQuote: true,
  printWidth: 100,
  overrides: [
    {
      files: '.editorconfig',
      options: {parser: 'yaml'},
    },
    {
      files: 'LICENSE',
      options: {parser: 'markdown'},
    },
  ],
};

export default config;
