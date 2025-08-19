// module.exports = {
//   // root: true,
//   extends: ["@equinor/eslint-config-eds-mobile"],
//   ignorePatterns: [
//     "*.spec.ts",
//     "*.spec.tsx",
//     "__mocks__/**",
//     "*.cjs",
//     "tsup.config.ts",
//     "jest-setup.ts",
//   ],
//   parserOptions: {
//     project: ["./tsconfig.json"],
//     tsconfigRootDir: __dirname,
//   },
//   settings: {
//     "import/parsers": {
//       "@typescript-eslint/parser": [".ts", ".tsx"],
//     },
//     "import/resolver": {
//       typescript: {
//         alwaysTryTypes: true,
//         project: ["packages/*/tsconfig.json", "./tsconfig.json"],
//       },
//     },
//   },
// };

// import edsMobile from "@equinor/eslint-config-eds-mobile";
// import { globalIgnores } from "eslint/config";
// import tseslint from "typescript-eslint";
// import eslint from "@eslint/js";

// export default [
//   ...edsMobile,
//   eslint.configs.recommended,
//   ...tseslint.configs.recommended,
//   {
//     files: ["**/*.js", "**/*.cjs"],
//     plugins: { "@typescript-eslint": tseslint },
//     rules: { semi: "error", "no-unused-vars": "error" },
//   },

//   { files: ["**/*.js"], rules: { "no-undef": "error", semi: "warn" } },
//   globalIgnores(["**/build/**", "**/dist/**", "src/some/file/to/ignore.ts"]),
// ];

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  tseslint.configs.stylistic,
  {
    rules: {
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    },
  },
  {
    files: ["**/*.js", "**/*.cjs"],
    rules: { semi: "error", "no-unused-vars": "error" },
  },

  globalIgnores([
    "**/build/**",
    "**/dist/**",
    "**/__mocks__/**",
    "**/__tests__/**",
  ])
);
