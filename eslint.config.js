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
                project: "./tsconfig.eslint.json",
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
    {
        // Unmigrated Slice 2–4 components are excluded from tsc during the migration window.
        // Type-checked lint rules are disabled here to match — remove each entry as the component is migrated.
        // Keep in sync with the exclude list in tsconfig.json.
        files: [
            "src/components/Accordion/**",
            "src/components/Autocomplete/**",
            "src/components/Cell/**",
            "src/components/Chip/**",
            "src/components/Environment/**",
            "src/components/Menu/**",
            "src/components/OfflineBanner/**",
            "src/components/Popover/**",
            "src/components/Progress/**",
            "src/components/ProgressIndicator/**",
            "src/components/Search/**",
            "src/components/Select/**",
            "src/components/Spacer/**",
            "src/components/Tabs/**",
        ],
        ...tseslint.configs.disableTypeChecked,
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
