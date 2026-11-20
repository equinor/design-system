/**
 * The demo of the window is published on the public docs site, with a sample
 * file made from two fixtures (demo/sample/sanitise.ts). The cleaned
 * fixtures must have no internal names or ids left, and the plugin's rules
 * must give them the same statuses and targets as the originals.
 */
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import {
  DETAILS_PANEL_NAMES,
  SAMPLE_FILE_NAME,
  WELL_OVERVIEW_NAMES,
  sanitiseFixture,
} from '../demo/sample/sanitise'
import { classifyUnits } from '../src/scan/classify'
import { unpackFixture } from '../src/scan/fixture'
import type { PackedFixture } from '../src/scan/fixture'

const read = (name: string) =>
  JSON.parse(
    readFileSync(new URL(`./fixtures/${name}.json`, import.meta.url), 'utf8'),
  ) as PackedFixture

const FIXTURES = [
  { name: 'test-frame', names: WELL_OVERVIEW_NAMES, idPrefix: 10 },
  { name: 'nested-instances', names: DETAILS_PANEL_NAMES, idPrefix: 20 },
]

/** What a rule decides for a value, without the ids and names. */
const decisions = (fixture: PackedFixture) =>
  classifyUnits(unpackFixture(fixture)).map((record) => ({
    category: record.category,
    outcome: record.outcome,
    candidates: record.candidates,
    rule: record.rule,
    old: record.old,
  }))

describe.each(FIXTURES)('the sample made from $name', (options) => {
  const original = read(options.name)
  const sample = sanitiseFixture(original, options)
  const text = JSON.stringify(sample)

  it('is called Sample file and has no internal names left', () => {
    expect(sample.fileName).toBe(SAMPLE_FILE_NAME)
    for (const name of [
      original.fileName,
      ...Object.keys(options.names),
      'FRIOD',
      'PE Editor',
      'Casper',
      'Main Design',
      'AI Testing',
    ]) {
      expect(text).not.toContain(name)
    }
  })

  it('has new layer and variable ids, in the shape the scan reads', () => {
    const oldIds = [
      original.frame.id,
      ...Object.keys(original.nodes).filter((id) => /\d+:\d+/.test(id)),
      ...Object.keys(original.variables),
    ]
    for (const id of oldIds) expect(text).not.toContain(`"${id}"`)
    for (const unit of sample.units) {
      expect(unit.node).toMatch(/^I?\d+:\d+(;\d+:\d+)*$/)
    }
  })

  it('gets the same statuses and targets from the rules', () => {
    expect(decisions(sample)).toEqual(decisions(original))
  })
})
