/**
 * Tests for the component data that `@equinor/eds-cli` reads. They build the
 * data from the real components, because the point is that every component a
 * consumer can import ends up in it with usable content. Node's own runner, so
 * no new dependency: `pnpm run test:scripts`.
 */

const { test, describe, before } = require('node:test')
const assert = require('node:assert')
const fs = require('fs')
const path = require('path')

const { buildAgentData, SCHEMA_VERSION } = require('./generate-agent-data')
const { discoverPublicComponents } = require('./generate-component-index')

describe('agent data', () => {
  let data
  const byName = (name) => data.components.find((c) => c.name === name)

  before(() => {
    data = buildAgentData()
  })

  test('carries the schema version, the beta version and the install line', () => {
    assert.strictEqual(data.schemaVersion, SCHEMA_VERSION)
    assert.strictEqual(data.package, '@equinor/eds-core-react')
    assert.match(data.version, /^\d+\.\d+\.\d+-beta\.\d+$/)
    assert.match(data.installLine, /@equinor\/eds-core-react@beta/)
  })

  test('has one entry for every exported component', () => {
    const exported = discoverPublicComponents()
      .map((c) => c.name)
      .sort()
    assert.deepStrictEqual(data.components.map((c) => c.name).sort(), exported)
  })

  test('every component has an import line and a React DOM base type', () => {
    for (const component of data.components) {
      assert.match(
        component.importLine,
        new RegExp(`import \\{ ${component.name} \\} from`),
      )
      assert.ok(component.baseTypes.length > 0, component.name)
    }
  })

  test('a documented component has props, examples and guidance', () => {
    const button = byName('Button')
    assert.ok(button.description)
    const variant = button.props.find((p) => p.name === 'variant')
    assert.strictEqual(variant.type, "'primary' | 'secondary' | 'ghost'")
    assert.strictEqual(variant.default, "'primary'")
    assert.ok(variant.description)
    assert.ok(button.examples.length > 0)
    assert.ok(button.examples.every((e) => e.title && e.code))
    assert.ok(button.guidance.usage)
    assert.ok(button.guidance.accessibility)
  })

  test('source links are pinned to the beta release tag', () => {
    const { source } = byName('Button').links
    assert.ok(
      source.includes(`/blob/eds-core-react-next@v${data.version}/`),
      source,
    )
  })

  // Picked from the real components rather than named, so the test keeps
  // working as components get docs and stories (#5467).
  test('a component without sidecar or stories still gets an entry', (t) => {
    const bare = discoverPublicComponents().filter(
      ({ name, dir }) =>
        !fs.existsSync(path.join(dir, `${name}.docs.md`)) &&
        !fs.existsSync(path.join(dir, `${name}.stories.tsx`)),
    )
    if (bare.length === 0) {
      t.skip('every component has a sidecar or stories')
      return
    }
    for (const { name } of bare) {
      const component = byName(name)
      assert.deepStrictEqual(component.examples, [], name)
      assert.deepStrictEqual(component.guidance, {}, name)
      // Props may be empty when the type is just a React DOM type (Menu).
      assert.ok(component.baseTypes.length > 0, name)
    }
  })

  test('lists compound sub-components', () => {
    assert.deepStrictEqual(byName('Field').subComponents, [
      'Field.Label',
      'Field.Description',
      'Field.HelperMessage',
    ])
  })

  test('names the base type and the keys an Omit removes, once each', () => {
    const [base] = byName('TextField').baseTypes
    assert.strictEqual(base.name, 'InputHTMLAttributes<HTMLInputElement>')
    assert.strictEqual(new Set(base.omitted).size, base.omitted.length)
  })
})
