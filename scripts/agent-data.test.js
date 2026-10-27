/**
 * Tests for the component data that `@equinor/eds-cli` reads. They build the
 * data from the real components, because the point is that every component a
 * consumer can import ends up in it with usable content. Node's own runner, so
 * no new dependency: `pnpm run test:scripts`.
 */

const { test, describe, before } = require('node:test')
const assert = require('node:assert')

const { buildAgentData, SCHEMA_VERSION } = require('./generate-agent-data')
const { discoverPublicComponents } = require('./generate-component-index')

describe('agent data', () => {
  let data
  const byName = (name) => data.components.find((c) => c.name === name)

  before(() => {
    data = buildAgentData()
  })

  test('carries the schema version and the install line', () => {
    assert.strictEqual(data.schemaVersion, SCHEMA_VERSION)
    assert.strictEqual(data.package, '@equinor/eds-core-react')
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

  test('a component without sidecar or stories still gets an entry', () => {
    const menuItem = byName('MenuItem')
    assert.deepStrictEqual(menuItem.examples, [])
    assert.deepStrictEqual(menuItem.guidance, {})
    assert.ok(menuItem.props.length > 0)
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
