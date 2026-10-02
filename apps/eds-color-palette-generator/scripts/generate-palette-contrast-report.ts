#!/usr/bin/env ts-node
/*
 * Script: generate-palette-contrast-report.ts
 * Purpose: Generate color scales for each base color and compute current contrast values
 * Uses helper functions from src/utils/color.ts (generateColorScale, contrast)
 * Output: PALETTE_CONTRAST_REPORT.md
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { paletteConfig as config } from '../src/config/palette-config'
import {
  PALETTE_STEPS,
  lightnessValuesInLightMode,
  darknessValuesInDarkMode,
} from '../src/config/config'
import { generateColorScale, contrast } from '../src/utils/color'
import { ColorDefinition, ColorAnchor } from '../src/types'
import Color from 'colorjs.io'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface RequirementRow {
  foreground: string
  background: string
  pairing: string
  requiredApca: number
  requiredWcag: number
}

interface ContrastResultRow extends RequirementRow {
  lightApca: string
  lightWcag: string
  darkApca: string
  darkWcag: string
  lightApcaPass: boolean
  lightWcagPass: boolean
  darkApcaPass: boolean
  darkWcagPass: boolean
}

const outPath = path.join(__dirname, '..', 'PALETTE_CONTRAST_REPORT.md')

function getRequirements(): RequirementRow[] {
  const rows: RequirementRow[] = []
  PALETTE_STEPS.forEach((step) => {
    step.contrastWith?.forEach((req) => {
      rows.push({
        foreground: step.id,
        background: req.targetStep,
        pairing: req.pairing,
        requiredApca: req.lc.value,
        requiredWcag: req.wcag.value,
      })
    })
  })
  return rows
}

/**
 * Helper function to get color input from a ColorDefinition
 */
function getColorInput(colorDef: ColorDefinition): ColorAnchor[] | string {
  return 'anchors' in colorDef ? colorDef.anchors : colorDef.value
}

function buildScales() {
  const lightSteps = lightnessValuesInLightMode
  const darkSteps = darknessValuesInDarkMode
  return config.colors.map((c) => {
    const colorInput = getColorInput(c)
    const lightScale = generateColorScale(
      colorInput,
      lightSteps,
      config.meanLight,
      config.stdDevLight,
      'OKLCH',
    )
    const darkScale = generateColorScale(
      colorInput,
      darkSteps,
      config.meanDark,
      config.stdDevDark,
      'OKLCH',
    )
    const mapping: Record<string, { light: string; dark: string }> = {}
    PALETTE_STEPS.forEach((step, idx) => {
      mapping[step.id] = { light: lightScale[idx], dark: darkScale[idx] }
    })
    return {
      name: c.name,
      value: 'value' in c ? c.value : undefined,
      mapping,
    }
  })
}

function computeContrasts() {
  const requirements = getRequirements()
  const scales = buildScales()
  // For each color scale produce rows
  return scales.map((scale) => {
    const rows: ContrastResultRow[] = requirements.map((req) => {
      const fgLight = scale.mapping[req.foreground].light
      const bgLight = scale.mapping[req.background].light
      const fgDark = scale.mapping[req.foreground].dark
      const bgDark = scale.mapping[req.background].dark
      const lightApca = contrast({
        foreground: fgLight,
        background: bgLight,
        algorithm: 'APCA',
      })
      const lightWcag = contrast({
        foreground: fgLight,
        background: bgLight,
        algorithm: 'WCAG21',
      })
      const darkApca = contrast({
        foreground: fgDark,
        background: bgDark,
        algorithm: 'APCA',
      })
      const darkWcag = contrast({
        foreground: fgDark,
        background: bgDark,
        algorithm: 'WCAG21',
      })
      const lightApcaNum = Number(lightApca)
      const lightWcagNum = Number(lightWcag)
      const darkApcaNum = Number(darkApca)
      const darkWcagNum = Number(darkWcag)
      return {
        ...req,
        lightApca: String(lightApca),
        lightWcag: String(lightWcag),
        darkApca: String(darkApca),
        darkWcag: String(darkWcag),
        lightApcaPass: lightApcaNum >= req.requiredApca,
        lightWcagPass: lightWcagNum >= req.requiredWcag,
        darkApcaPass: darkApcaNum >= req.requiredApca,
        darkWcagPass: darkWcagNum >= req.requiredWcag,
      }
    })
    return { scale, rows }
  })
}

function buildContrastTables() {
  const datasets = computeContrasts()
  return datasets
    .map(({ scale, rows }) => {
      const header =
        '| Pairing (Tokens Studio) | Steps | Fg Light HEX | Fg Dark HEX | Bg Light HEX | Bg Dark HEX | Light APCA | Dark APCA | Required APCA | Light WCAG | Dark WCAG |'
      const sep =
        '| ----------------------- | ----- | ------------ | ----------- | ------------ | ----------- | ---------- | --------- | ------------- | ---------- | --------- |'
      const toHex = (val: string): string => {
        try {
          return new Color(val).toString({ format: 'hex' })
        } catch {
          return '#000000'
        }
      }
      const steps = (id: string) => id.replace('step-', '')
      const lines = rows.map(
        (r) =>
          `| \`${r.pairing}\` | ${steps(r.foreground)} on ${steps(r.background)} | ${toHex(scale.mapping[r.foreground].light)} | ${toHex(scale.mapping[r.foreground].dark)} | ${toHex(scale.mapping[r.background].light)} | ${toHex(scale.mapping[r.background].dark)} | ${r.lightApca}${r.lightApcaPass ? ' ✅' : ' ❌'} | ${r.darkApca}${r.darkApcaPass ? ' ✅' : ' ❌'} | ${r.requiredApca} | ${r.lightWcag} | ${r.darkWcag} |`,
      )
      // ADR 0016 Confirmation 5 asserts APCA only; WCAG is shown for reference.
      const total = rows.length * 2
      const passed = rows.reduce(
        (acc, r) => acc + (r.lightApcaPass ? 1 : 0) + (r.darkApcaPass ? 1 : 0),
        0,
      )
      const summaryLine = `\n**APCA pass summary:** ${passed}/${total} checks (${((passed / total) * 100).toFixed(1)}%)`
      return `### ${scale.name} (${scale.value})\n\n${header}\n${sep}\n${lines.join('\n')}${summaryLine}`
    })
    .join('\n\n')
}

function generate() {
  const date = new Date().toISOString().split('T')[0]
  const content = `# Palette contrast report\n\nGenerated: ${date}\n\nThe seven Tokens Studio hues generated with the Tokens Studio scale, checked against the APCA targets in ADR 0016 (Confirmation 5): text and icon roles against \`background.surface\`, \`on-emphasis\` against the emphasis fill. Each pair is checked inside every hue, so for hues other than the neutral one, step 15 of that hue stands in for \`background.surface\` (\`neutral.15\`). Borders are out of scope in the ADR and are not checked. WCAG 2.1 ratios are shown for reference only.\n\n## Contrast values\n\n${buildContrastTables()}\n\n---\n\n_This document is generated by \`pnpm generate:palette-contrast-report\`. The values come from Tokens Studio (\`src/config/tokensStudio.ts\`); the requirements are in \`src/config/config.ts\`._\n`
  fs.writeFileSync(outPath, content, 'utf8')
  console.log(
    `Contrast report generated -> ${path.relative(process.cwd(), outPath)}`,
  )
}

generate()
