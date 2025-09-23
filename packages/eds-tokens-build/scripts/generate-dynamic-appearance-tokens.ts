#!/usr/bin/env node
import path from "node:path";

import type { TokenConfig } from "./utils/index.js";
import {
  loadTokenConfig,
  writeJson,
  isObject,
  validatePaletteFamilies,
  buildToken,
  varName,
} from "./utils/index.js";

function generateAppearanceForPalette(
  paletteFamily: string,
  variablePrefix: string,
): Record<string, any> {
  const make = (ref: string, desc = "", web?: string) =>
    buildToken(ref, desc, web);

  const textDescriptions = {
    Subtle: "Used for text and icons",
    Strong: "Used for text and icons",
    "Subtle on emphasis": "Text or icons against colored backgrounds",
    "Strong on emphasis": "Text or icons against colored backgrounds",
  } as const;

  // Build WEB var names
  const bgCanvas = varName(variablePrefix, "bg", "default");
  const bgSurface = varName(variablePrefix, "bg", "subtle");
  const bgFillMutedDefault = varName(variablePrefix, "bg", "medium-default");
  const bgFillMutedHover = varName(variablePrefix, "bg", "medium-hover");
  const bgFillMutedActive = varName(variablePrefix, "bg", "medium-active");
  const bgFillEmphasisDefault = varName(variablePrefix, "bg", "strong-default");
  const bgFillEmphasisHover = varName(variablePrefix, "bg", "strong-hover");
  const bgFillEmphasisActive = varName(variablePrefix, "bg", "strong-active");

  const borderSubtle = varName(variablePrefix, "border", "subtle");
  const borderMedium = varName(variablePrefix, "border", "medium");
  const borderStrong = varName(variablePrefix, "border", "strong");

  const textSubtle = varName(variablePrefix, "text", "default");
  const textStrong = varName(variablePrefix, "text", "strong");
  const textSubtleOnEmphasis = varName(
    variablePrefix,
    "text",
    "contrast-subtle",
  );
  const textStrongOnEmphasis = varName(
    variablePrefix,
    "text",
    "contrast-strong",
  );

  return {
    Bg: {
      Fill: {
        Muted: {
          Default: make(`{${paletteFamily}.3}`, "", bgFillMutedDefault),
          Hover: make(`{${paletteFamily}.4}`, "", bgFillMutedHover),
          Active: make(`{${paletteFamily}.5}`, "", bgFillMutedActive),
        },
        Emphasis: {
          Default: make(`{${paletteFamily}.9}`, "", bgFillEmphasisDefault),
          Hover: make(`{${paletteFamily}.10}`, "", bgFillEmphasisHover),
          Active: make(`{${paletteFamily}.11}`, "", bgFillEmphasisActive),
        },
      },
      Canvas: make(`{${paletteFamily}.1}`, "", bgCanvas),
      Surface: make(`{${paletteFamily}.2}`, "", bgSurface),
    },
    Border: {
      Subtle: make(`{${paletteFamily}.6}`, "", borderSubtle),
      Medium: make(`{${paletteFamily}.7}`, "", borderMedium),
      Strong: make(`{${paletteFamily}.8}`, "", borderStrong),
    },
    Text: {
      Subtle: make(
        `{${paletteFamily}.12}`,
        textDescriptions.Subtle,
        textSubtle,
      ),
      Strong: make(
        `{${paletteFamily}.13}`,
        textDescriptions.Strong,
        textStrong,
      ),
      "Subtle on emphasis": make(
        `{${paletteFamily}.14}`,
        textDescriptions["Subtle on emphasis"],
        textSubtleOnEmphasis,
      ),
      "Strong on emphasis": make(
        `{${paletteFamily}.15}`,
        textDescriptions["Strong on emphasis"],
        textStrongOnEmphasis,
      ),
    },
  } as Record<string, any>;
}

async function generate(cfg: TokenConfig) {
  const tokenConfig = cfg || {};

  const foundationId = (tokenConfig.figmaProjectFoundationId ?? "").trim();
  const dynamicId = (tokenConfig.figmaProjectDynamicId ?? "").trim();
  if (!foundationId) {
    console.error(
      "Missing figmaProjectFoundationId. Set it in token-config.json (figmaProjectFoundationId).",
    );
    process.exit(1);
  }
  if (!dynamicId) {
    console.error(
      "Missing figmaProjectDynamicId. Set it in token-config.json (figmaProjectDynamicId).",
    );
    process.exit(1);
  }

  const mapping = tokenConfig.semanticColorCategories;
  if (!isObject(mapping) || Object.keys(mapping).length === 0) {
    console.error("Missing semanticColorCategories in token-config.json.");
    process.exit(1);
  }

  const variablePrefix = (tokenConfig.variablePrefix ?? "x").trim();

  // Validate that mapped palette families exist in light palette (warning-only)
  await validatePaletteFamilies(
    foundationId,
    mapping as Record<string, string>,
    "generate-dynamic-appearance-tokens",
  );

  const outDir = path.join("tokens", dynamicId);

  for (const [semantic, paletteFamily] of Object.entries(
    mapping as Record<string, string>,
  )) {
    // File name with emoji prefix
    const fileName = `🎨 Appearance.${semantic}.json`;
    const filePath = path.join(outDir, fileName);

    const appearanceJson = generateAppearanceForPalette(
      String(paletteFamily),
      variablePrefix,
    );

    await writeJson(filePath, appearanceJson);
    console.log(`Generated: ${path.relative(process.cwd(), filePath)}`);
  }
}

async function main() {
  const cfg = loadTokenConfig();
  await generate(cfg);
}

main().catch((err) => {
  console.error("[generate-dynamic-appearance-tokens] Failed:");
  console.error(err);
  process.exit(1);
});
