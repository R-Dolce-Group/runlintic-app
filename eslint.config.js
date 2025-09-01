const js = require("@eslint/js");
const tseslint = require("typescript-eslint");
const onlyWarn = require("eslint-plugin-only-warn");
const globals = require("globals");

/**
 * ESLint configuration for runlintic-app NPM package
 */
module.exports = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.commonjs,
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
  {
    files: ["**/*.cjs", "**/bin/**/*.js", "**/lib/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.commonjs,
      },
      sourceType: "commonjs",
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    plugins: {
      onlyWarn,
    },
  },
  {
    files: ["eslint.config.js", "commitlint.config.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off"
    }
  },
  {
    ignores: [
      "node_modules/**",
      "public/**",
      ".turbo/**",
      "CHANGELOG.md"
    ]
  }
];