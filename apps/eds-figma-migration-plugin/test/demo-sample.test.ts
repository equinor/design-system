/**
 * The demo of the window is published on the public docs site, with a sample
 * file made from two fixtures, whose layers and variables get new ids at
 * build time (demo/sample/sanitise.ts). The fixtures go into the built demo,
 * so they must be called Sample file and have no file or library keys. The
 * new ids must keep the shape the scan reads, and the plugin's rules must
 * give the fixtures the same statuses and targets with the new ids as with
 * the old.
 */
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { sanitiseFixture } from '../demo/sample/sanitise'
import { classifyUnits } from '../src/scan/classify'
import { unpackFixture } from '../src/scan/fixture'
import type { PackedFixture } from '../src/scan/fixture'

const read = (name: string) =>
  readFileSync(new URL(`./fixtures/${name}.json`, import.meta.url), 'utf8')

const FIXTURES = [
  { name: 'test-frame', idPrefix: 10 },
  { name: 'nested-instances', idPrefix: 20 },
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
  const json = read(options.name)
  const original = JSON.parse(json) as PackedFixture
  const sample = sanitiseFixture(original, options)
  const text = JSON.stringify(sample)

  it('is called Sample file and has no file or library keys', () => {
    expect(original.fileName).toBe('Sample file')
    expect(json).not.toMatch(/fileKey/)
    expect(json).not.toMatch(/lk-[0-9a-f]{16,}/)
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
