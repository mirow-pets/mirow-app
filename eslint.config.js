// https://docs.expo.dev/guides/using-eslint/
const pluginJs = require("@eslint/js");
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      ...pluginJs.configs.recommended.rules,
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "import/order": [
        "error",
        {
          groups: [
            "builtin", // e.g. fs, path
            "external", // e.g. react
            "internal", // e.g. your src/*
            ["parent", "sibling", "index"],
            "object",
            "type",
          ],
          pathGroups: [
            {
              pattern: "{react,react-native/**,react-native}",
              group: "external",
              position: "before",
            },
            {
              pattern: "@/**",
              group: "internal",
            },
          ],
          // important: exclude these so they are not merged with other externals
          pathGroupsExcludedImportTypes: ["react"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc", // Sort A→Z
            caseInsensitive: true,
          },
        },
      ],
      "prefer-arrow-callback": ["error"],
    },
  },
]);
