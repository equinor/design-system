#!/usr/bin/env ts-node
/*
 * Script: generate-palette-overview.ts
 * Purpose: Regenerate PALETTE_OVERVIEW.md from src/config/config.ts
 * Usage: pnpm generate:palette
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PALETTE_STEPS, StepDefinition } from '../src/config/config'
import { APCA_CONTRAST_LEVELS } from '../src/config/APCA_CONTRAST_LEVELS'
import { WCAG_CONTRAST_LEVELS } from '../src/config/WCAG_CONTRAST_LEVELS'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface ContrastRow {
  foreground: string
  background: string
  apca: number
  wcagKey: string
  wcagValue: number
}

const outPath = path.join(__dirname, '..', 'PALETTE_OVERVIEW.md')

function mdEscape(text: string) {
  return text.replace(/\|/g, '\\|')
}

function formatNumber(n: number, digits = 2) {
  return n.toFixed(digits)
}

function hasContrast(step: StepDefinition) {
  return step.contrastWith && step.contrastWith.length > 0
}

function buildStepsTable() {
  const header =
    '| ID | Name | Category | Variant | Light (L) | Dark (L) | Contrast Reqs |'
  const sep =
    '| --- | ---- | -------- | ------- | --------- | -------- | ------------- |'
  const rows = PALETTE_STEPS.map((s) =>
    [
      s.id,
      s.name,
      s.category,
      s.variant,
      formatNumber(s.lightValue, 2),
      formatNumber(s.darkValue, 2),
      hasContrast(s) ? 'Yes' : '',
    ]
      .map((v) => mdEscape(String(v)))
      .join(' | '),
  )
  return [header, sep, ...rows.map((r) => `| ${r} |`)].join('\n')
}

function buildContrastRows(): ContrastRow[] {
  const rows: ContrastRow[] = []
  PALETTE_STEPS.forEach((s) => {
    s.contrastWith?.forEach((req) => {
      // derive WCAG key by matching value
      const wcagKey =
        Object.keys(WCAG_CONTRAST_LEVELS).find(
          (k) =>
            WCAG_CONTRAST_LEVELS[k as keyof typeof WCAG_CONTRAST_LEVELS]
              .value === req.wcag.value,
        ) || 'UNKNOWN'
      rows.push({
        foreground: s.id,
        background: req.targetStep,
        apca: req.lc.value,
        wcagKey,
        wcagValue: req.wcag.value,
      })
    })
  })
  return rows
}

function buildContrastTable() {
  const header = '| Foreground | Background | APCA | WCAG |'
  const sep = '| --------------- | --------------- | ------- | ----------- |'
  const rows = buildContrastRows().map(
    (r) =>
      `| ${r.foreground} | ${r.background} | ${r.apca} | ${r.wcagKey} (${r.wcagValue}) |`,
  )
  return [header, sep, ...rows].join('\n')
}

function buildApcaLevelsTable() {
  const header = '| Key | LC Value | Description |'
  const sep = '| --- | -------- | ----------- |'
  const rows = Object.entries(APCA_CONTRAST_LEVELS).map(
    ([key, val]) => `| ${key} | ${val.value} | ${mdEscape(val.description)} |`,
  )
  return [header, sep, ...rows].join('\n')
}

function buildWcagLevelsTable() {
  const header = '| Key | Ratio | Description |'
  const sep = '| --- | ----- | ----------- |'
  const rows = Object.entries(WCAG_CONTRAST_LEVELS).map(
    ([key, val]) => `| ${key} | ${val.value} | ${mdEscape(val.description)} |`,
  )
  return [header, sep, ...rows].join('\n')
}

function generate() {
  const date = new Date().toISOString().split('T')[0]
  const content = `# EDS Color Palette Configuration Overview\n\n_Generated overview of the current palette configuration (step values, contrast requirements, and reference contrast levels)._\n\nGenerated: ${date}\n\n## Step Definitions\n\n${buildStepsTable()}\n\n## Contrast Requirements (Foreground → Background)\n\n_APCA LC value shown is the required Lightness Contrast. WCAG column shows level key and numeric ratio._\n\n${buildContrastTable()}\n\n## APCA Contrast Levels Reference\n\n${buildApcaLevelsTable()}\n\n## WCAG Contrast Levels Reference\n\n${buildWcagLevelsTable()}\n\n---\n\n_This document is auto-generated; update \`config.ts\` to change source values._\n`
  fs.writeFileSync(outPath, content, 'utf8')
  console.log(
    `Palette overview generated -> ${path.relative(process.cwd(), outPath)}`,
  )
}

generate()
