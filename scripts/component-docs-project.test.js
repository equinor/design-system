/**
 * Tests that the generator reads props through a type imported from another
 * component, which the layout tests in component-docs.test.js leave out. Uses
 * the real mobile components, so it also fails if TextField stops taking its
 * input props from Input. `pnpm run test:scripts`.
 */

const { test, describe } = require('node:test')
const assert = require('node:assert')

const { PLATFORMS } = require('./component-docs/config')
const { locate, findPropsDeclaration } = require('./component-docs/locate')
const { extractProps } = require('./component-docs/props')
const { createProject } = require('./component-docs/project')

describe('props read through an imported base type', () => {
  test('mobile TextField lists the props it takes from Input, when generated alone', () => {
    const project = createProject()
    const { dir } = locate(PLATFORMS.mobile, 'TextField')
    const names = extractProps(
      findPropsDeclaration(project, dir, 'TextField'),
    ).map((prop) => prop.name)

    assert.ok(names.includes('label'), 'its own prop is listed')
    assert.ok(names.includes('placeholder'), 'a prop from Input is listed')
  })

  test('mobile Search lists the props it takes from Input, when generated alone', () => {
    const project = createProject()
    const { dir } = locate(PLATFORMS.mobile, 'Search')
    const names = extractProps(
      findPropsDeclaration(project, dir, 'Search'),
    ).map((prop) => prop.name)

    assert.ok(names.includes('cancellable'), 'its own prop is listed')
    assert.ok(names.includes('placeholder'), 'a prop from Input is listed')
  })
})
