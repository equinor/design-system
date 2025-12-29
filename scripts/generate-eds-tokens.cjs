#!/usr/bin/env node
/**
 * Build-time script to generate TypeScript from EDS JSON tokens.
 *
 * This runs during `pnpm build` BEFORE tsup compilation.
 * It reads the EDS JSON files and outputs a static TypeScript file
 * that can be imported normally (no runtime require() needed).
 *
 * To update tokens when @equinor/eds-tokens is updated:
 * 1. Run `pnpm install` (updates the package)
 * 2. Run `pnpm build` (regenerates the tokens)
 */

const fs = require("fs");
const path = require("path");

// Find the eds-tokens package in node_modules (works from any directory)
const findEdsTokensPath = () => {
    // Start from this script's directory and walk up to find node_modules
    let dir = __dirname;
    while (dir !== path.dirname(dir)) {
        const candidate = path.join(
            dir,
            "node_modules",
            "@equinor",
            "eds-tokens"
        );
        if (fs.existsSync(candidate)) {
            return candidate;
        }
        dir = path.dirname(dir);
    }
    // Fallback: check workspace root's node_modules
    const workspaceRoot = path.resolve(__dirname, "../../..");
    return path.join(workspaceRoot, "node_modules", "@equinor", "eds-tokens");
};

// Paths
const edsTokensPath = findEdsTokensPath();
const lightSemanticPath = path.join(
    edsTokensPath,
    "build/json/color/color-scheme/nested/light-semantic.json"
);
const darkSemanticPath = path.join(
    edsTokensPath,
    "build/json/color/color-scheme/nested/dark-semantic.json"
);
const outputPath = path.join(
    __dirname,
    "../src/styling/edsSemanticTokens.generated.ts"
);

// Read JSON files
const lightSemantic = JSON.parse(fs.readFileSync(lightSemanticPath, "utf8"));
const darkSemantic = JSON.parse(fs.readFileSync(darkSemanticPath, "utf8"));

// Generate TypeScript
const output = `// AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
// Generated from @equinor/eds-tokens semantic JSON files
// To regenerate: pnpm build (in packages/components)
// Source: @equinor/eds-tokens/build/json/color/color-scheme/nested/

import { EDSSemanticJson } from "./edsTokenTypes";

/**
 * EDS Light theme semantic color tokens
 * @generated from light-semantic.json
 */
export const lightSemantic: EDSSemanticJson = ${JSON.stringify(lightSemantic, null, 2)} as const;

/**
 * EDS Dark theme semantic color tokens
 * @generated from dark-semantic.json
 */
export const darkSemantic: EDSSemanticJson = ${JSON.stringify(darkSemantic, null, 2)} as const;
`;

// Write output
fs.writeFileSync(outputPath, output, "utf8");

console.log("✅ Generated EDS semantic tokens at:");
console.log(`   ${path.relative(process.cwd(), outputPath)}`);
