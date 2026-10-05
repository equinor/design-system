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
            // A props spread placed after an explicit style or accessibilityState
            // attribute replaces that value outright instead of merging into it, so
            // a caller passing either one silently drops the component's own
            // container styles or computed accessibility state. Put the spread
            // first and merge the caller's value in explicitly. See #5411.
            "no-restricted-syntax": [
                "error",
                {
                    selector:
                        'JSXOpeningElement > JSXAttribute[name.name=/^(style|accessibilityState)$/] ~ JSXSpreadAttribute',
                    message:
                        "Move this props spread above the element's style/accessibilityState attribute, then merge the caller's value in explicitly (see mergePressableStyle, or the [ownStyle, rest.style] pattern). A spread after those attributes replaces them wholesale.",
                },
            ],
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
        // Keep in sync with the exclude list in tsconfig.json and the testPathIgnorePatterns list in jest.config.cjs.
        files: [
            "src/components/Accordion/**",
            "src/components/Autocomplete/**",
            "src/components/Cell/**",
            "src/components/Chip/**",
            "src/components/Dialog/**",
            "src/components/Environment/**",
            "src/components/Menu/**",
            "src/components/OfflineBanner/**",
            "src/components/Popover/**",
            "src/components/Progress/**",
            "src/components/ProgressIndicator/**",
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
        "jest.config.cjs",
    ])
);
