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
import config, {
  PALETTE_STEPS,
  lightnessValuesInLightMode,
  darknessValuesInDarkMode,
} from '../src/config/config'
import { generateColorScale, contrast } from '../src/utils/color'
import Color from 'colorjs.io'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface RequirementRow {
  foreground: string
  background: string
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
        requiredApca: req.lc.value,
        requiredWcag: req.wcag.value,
      })
    })
  })
  return rows
}

function buildScales() {
  const lightSteps = lightnessValuesInLightMode
  const darkSteps = darknessValuesInDarkMode
  return config.colors.map((c) => {
    const lightScale = generateColorScale(
      c.hex,
      lightSteps,
      config.mean,
      config.stdDev,
      'OKLCH',
    )
    const darkScale = generateColorScale(
      c.hex,
      darkSteps,
      config.mean,
      config.stdDev,
      'OKLCH',
    )
    const mapping: Record<string, { light: string; dark: string }> = {}
    PALETTE_STEPS.forEach((step, idx) => {
      mapping[step.id] = { light: lightScale[idx], dark: darkScale[idx] }
    })
    return { name: c.name, hex: c.hex, mapping }
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
        '| Foreground | Background | Fg Light HEX | Fg Dark HEX | Bg Light HEX | Bg Dark HEX | Light APCA | Light WCAG | Dark APCA | Dark WCAG | Required APCA | Required WCAG |'
      const sep =
        '| ---------- | ---------- | ------------ | ----------- | ------------ | ----------- | ---------- | ----------- | --------- | --------- | ------------- | ------------- |'
      const toHex = (val: string): string => {
        try {
          return new Color(val).toString({ format: 'hex' })
        } catch {
          return '#000000'
        }
      }
      const lines = rows.map(
        (r) =>
          `| ${r.foreground} | ${r.background} | ${toHex(scale.mapping[r.foreground].light)} | ${toHex(scale.mapping[r.foreground].dark)} | ${toHex(scale.mapping[r.background].light)} | ${toHex(scale.mapping[r.background].dark)} | ${r.lightApca}${r.lightApcaPass ? ' ✅' : ' ❌'} | ${r.lightWcag}${r.lightWcagPass ? ' ✅' : ' ❌'} | ${r.darkApca}${r.darkApcaPass ? ' ✅' : ' ❌'} | ${r.darkWcag}${r.darkWcagPass ? ' ✅' : ' ❌'} | ${r.requiredApca} | ${r.requiredWcag} |`,
      )
      const total = rows.length * 4
      const passed = rows.reduce(
        (acc, r) =>
          acc +
          (r.lightApcaPass ? 1 : 0) +
          (r.lightWcagPass ? 1 : 0) +
          (r.darkApcaPass ? 1 : 0) +
          (r.darkWcagPass ? 1 : 0),
        0,
      )
      const summaryLine = `\n**Pass Summary:** ${passed}/${total} checks (${((passed / total) * 100).toFixed(1)}%)`
      return `### ${scale.name} (${scale.hex})\n\n${header}\n${sep}\n${lines.join('\n')}${summaryLine}`
    })
    .join('\n\n')
}

function generate() {
  const date = new Date().toISOString().split('T')[0]
  const content = `# Palette Contrast Report\n\nGenerated: ${date}\n\n## Contrast Values\n\n${buildContrastTables()}\n\n---\n\n_This document is auto-generated; update \`config.ts\` or \`color.ts\` to change source values._\n`
  fs.writeFileSync(outPath, content, 'utf8')
  console.log(`Contrast report generated -> ${path.relative(process.cwd(), outPath)}`)
}

generate()
