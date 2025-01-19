import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  pluginJs.configs.recommended,
  {
    ignores: [
      "node_modules/", // Ignore the node_modules directory
      "dist/",         // Ignore the dist directory
      "build/",        // Ignore the build directory
      "*.config.js",   // Ignore all config files
      "**/__tests__/**", // Ignore test directories
      // Add any other files or directories you want to ignore
    ],
  },
];