/**
 * Tests that the generator finds the React Native types a props type is built
 * from, using the real mobile components. `pnpm run test:scripts`.
 */

const { test, describe } = require('node:test')
const assert = require('node:assert')
const { Project } = require('ts-morph')

const { PLATFORMS } = require('./component-docs/config')
const { locate, findPropsDeclaration } = require('./component-docs/locate')
const { extractBaseTypes, extractProps } = require('./component-docs/props')

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

describe('own props of a type that starts with a library type', () => {
  const propNamesOf = (source) => {
    const project = new Project({
      skipAddingFilesFromTsConfig: true,
      useInMemoryFileSystem: true,
    })
    project.createSourceFile(
      '/node_modules/lib/index.ts',
      'export type Base = { name: string; size?: number }',
    )
    const file = project.createSourceFile('/props.ts', source)
    return extractProps(file.getTypeAliasOrThrow('ThingProps')).map(
      (prop) => prop.name,
    )
  }

  test('lists a prop that is redeclared after the library type', () => {
    assert.deepStrictEqual(
      propNamesOf(`
        import type { Base } from './node_modules/lib'
        export type ThingProps = Base & {
          /** The name. */
          name: string
          /** The size. */
          size?: number
        }
      `),
      ['name', 'size'],
    )
  })

  test('leaves out a prop that only the library type declares', () => {
    assert.deepStrictEqual(
      propNamesOf(`
        import type { Base } from './node_modules/lib'
        export type ThingProps = Base & {
          /** The name. */
          name: string
        }
      `),
      ['name'],
    )
  })
})
