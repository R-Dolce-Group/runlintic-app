import js from "@eslint/js";
import tseslint from "typescript-eslint";
import onlyWarn from "eslint-plugin-only-warn";
import globals from "globals";

/**
 * ESLint configuration for runlintic-app NPM package
 */
export default [
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
      "CHANGELOG.md",
      "_workflows/**",
      "logs/**",
      "reports/**",
      "benchmark-results-*.json",
      "quality-gates-*.json",
      "decision-scorecard-*.json"
    ]
  }
];