/**
 * Tests that the generator finds the React Native types a props type is built
 * from, using the real mobile components. `pnpm run test:scripts`.
 */

const { test, describe } = require('node:test')
const assert = require('node:assert')
const { Project } = require('ts-morph')

const { PLATFORMS } = require('./component-docs/config')
const { locate, findPropsDeclaration } = require('./component-docs/locate')
const { extractBaseTypes } = require('./component-docs/props')

const baseTypesOf = (component) => {
  const project = new Project({ skipAddingFilesFromTsConfig: true })
  const { dir } = locate(PLATFORMS.mobile, component)
  return extractBaseTypes(findPropsDeclaration(project, dir, component))
}

describe('React Native base types of a mobile props type', () => {
  test('Button reaches PressableProps through its base type', () => {
    assert.deepStrictEqual(baseTypesOf('Button'), [
      { name: 'PressableProps', omitted: [] },
    ])
  })

  test('Divider is ViewProps', () => {
    assert.deepStrictEqual(baseTypesOf('Divider'), [
      { name: 'ViewProps', omitted: [] },
    ])
  })

  test('Input reaches TextInputProps through Omit and records what Omit removed', () => {
    assert.deepStrictEqual(baseTypesOf('Input'), [
      {
        name: 'TextInputProps',
        omitted: ['onChange', 'onChangeText', 'readOnly'],
      },
    ])
  })

  test('Link only borrows TextProps["onPress"], so it accepts no base type', () => {
    assert.deepStrictEqual(baseTypesOf('Link'), [])
  })
})
