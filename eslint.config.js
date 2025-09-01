const { config } = require("./lib/configs/base.js");

module.exports = [
  ...config,
  {
    ignores: [
      "apps/**",
      "packages/**", 
      "_workflows/**",
      "node_modules/**",
      "dist/**",
      ".next/**",
      "src/**"
    ]
  },
  {
    files: ["**/*.mjs"],
    languageOptions: {
      globals: {
        process: true
      },
      sourceType: "module"
    }
  },
  {
    files: ["eslint.config.js", "commitlint.config.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off"
    }
  }
];