"use strict";

const fs = require("fs");
const path = require("path");

// jest-expo's own default transformIgnorePatterns doesn't allow-list
// @equinor/eds-tokens, which ships raw, untranspiled TypeScript. We extend
// jest-expo's actual pattern (rather than hardcoding a guess) so this stays
// in sync if jest-expo ever changes its own default.
const jestExpoPreset = require("jest-expo/jest-preset");

const testPathIgnorePatterns = [
    "<rootDir>/node_modules/",
    "<rootDir>/dist/",
    // Unmigrated Slice 2–4 components — excluded from tsc (tsconfig.json)
    // and type-checked lint (eslint.config.js) during the migration
    // window. Remove each entry as its component migrates; keep all
    // three lists in sync.
    "<rootDir>/src/components/Accordion/",
    "<rootDir>/src/components/Autocomplete/",
    "<rootDir>/src/components/Cell/",
    "<rootDir>/src/components/Chip/",
    "<rootDir>/src/components/Environment/",
    "<rootDir>/src/components/Menu/",
    "<rootDir>/src/components/OfflineBanner/",
    "<rootDir>/src/components/Popover/",
    "<rootDir>/src/components/Progress/",
    "<rootDir>/src/components/ProgressIndicator/",
    "<rootDir>/src/components/Select/",
    "<rootDir>/src/components/Spacer/",
    "<rootDir>/src/components/Tabs/",
    // Migrated components with no test file yet (issue #214). Remove each
    // entry as soon as its ComponentName.test.tsx lands — this list is a
    // checklist, not a migration-status list like the one above.
    //
    // Dialog, ErrorBoundary, Icon, Label, Portal, Scrim, and _internal are
    // intentionally not on this checklist — they're internal/utility pieces
    // covered indirectly through the components that consume them, not with
    // dedicated test files of their own.
    //
    // Paper and PressableHighlight are also intentionally not on this
    // checklist — both are slated for removal/replacement (Paper -> Card,
    // PressableHighlight -> Pressable) once the library migration completes,
    // so we're not adding new tests for code we're about to delete.
    "<rootDir>/src/components/EDSProvider/",
    "<rootDir>/src/components/Input/",
    "<rootDir>/src/components/Search/",
    "<rootDir>/src/components/SelectionControls/",
    "<rootDir>/src/components/TextArea/",
    "<rootDir>/src/components/TextField/",
];

// Guard against the exact footgun these lists create: a follow-up PR adds
// ComponentName.test.tsx but forgets to delete the matching line above, so
// Jest silently skips the new test instead of running it — a checkmark with
// no coverage behind it. Fail loudly at config-load time instead.
function findTestFile(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const entryPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            const found = findTestFile(entryPath);
            if (found) return found;
        } else if (/\.test\.tsx?$/.test(entry.name)) {
            return entryPath;
        }
    }
    return null;
}

for (const pattern of testPathIgnorePatterns) {
    if (!pattern.includes("/src/components/")) continue;
    const dir = pattern.replace("<rootDir>", __dirname);
    if (!fs.existsSync(dir)) continue;
    const testFile = findTestFile(dir);
    if (testFile) {
        throw new Error(
            `${testFile} exists but ${dir} is still listed in ` +
                "jest.config.cjs's testPathIgnorePatterns, so it won't run. " +
                "Remove that entry now that the component has a test."
        );
    }
}

module.exports = {
    preset: "jest-expo",
    setupFiles: ["react-native-gesture-handler/jestSetup"],
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    // Reanimated 4.x delegates native threading to the separate
    // `react-native-worklets` package, which has no public "mock" subpath
    // export. This points directly at its built ESM mock module — verified
    // against the installed version; may need updating if react-native-worklets
    // changes its internal lib/ layout.
    moduleNameMapper: {
        "^react-native-worklets$": "react-native-worklets/lib/module/mock",
        "^test-utils$": "<rootDir>/test-utils",
    },
    transformIgnorePatterns: (() => {
        const basePattern = jestExpoPreset.transformIgnorePatterns[0];
        const extendedPattern = basePattern.replace(
            /\)\)$/,
            "|@equinor/eds-tokens))"
        );
        if (extendedPattern === basePattern) {
            throw new Error(
                "jest-expo's default transformIgnorePatterns format changed " +
                    "(no longer ends in '))'). Update the @equinor/eds-tokens " +
                    "patch in jest.config.cjs to match the new format."
            );
        }
        return [extendedPattern, ...jestExpoPreset.transformIgnorePatterns.slice(1)];
    })(),
    testPathIgnorePatterns,
};
