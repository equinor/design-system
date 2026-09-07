// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
    expoConfig,
    {
        ignores: ["dist/*"],
    },
    {
        settings: {
            "import/resolver": {
                typescript: {
                    project: "./tsconfig.json",
                },
            },
            // Allow workspace packages - Metro resolves these at runtime
            "import/internal-regex": "^@equinor/",
        },
        rules: {
            // Disable for workspace packages - pnpm symlinks aren't resolved by eslint-plugin-import
            "import/no-unresolved": ["error", { ignore: ["^@equinor/"] }],
        },
    },
]);
