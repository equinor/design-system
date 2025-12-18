import eslint from "@eslint/js";
import { globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            "@typescript-eslint/consistent-type-definitions": ["error", "type"],
        },
    },
    {
        files: ["**/*.js", "**/*.cjs"],
        ...tseslint.configs.disableTypeChecked,
        rules: { semi: "error", "no-unused-vars": "error" },
    },

    globalIgnores([
        "**/build/**",
        "**/dist/**",
        "**/__mocks__/**",
        "**/__tests__/**",
        "**/tsup.config.ts",
        "eslint.config.js",
    ])
);
