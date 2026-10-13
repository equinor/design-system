/**
 * Tests for how the docs generator lays out the web page around the Overview
 * story: where it goes, that it is not listed as an example, and that the build
 * stops when it is missing.
 *
 * The page layout is the contract, so the tests render a page from a small
 * hand-built context and read the result as text. ts-morph and the real
 * components are left out, because they only produce the context these rules
 * then lay out. Node's own runner, so no new dependency: `pnpm run test:scripts`.
 */

const { test, describe } = require('node:test')
const assert = require('node:assert')

const { renderWeb, renderMobile } = require('./component-docs/render')
const { DocsError } = require('./component-docs/errors')

const story = (name, extra = {}) => ({
  name,
  title: name,
  caption: undefined,
  code: `<Thing variant="${name}" />`,
  ...extra,
})

const context = (stories, overrides = {}) => ({
  relDir: 'packages/example/Thing',
  props: [],
  stories,
  sidecar: {
    Summary: 'Thing is an example.',
    Features: '- It does something.',
    Usage: '```tsx\n<Thing />\n```',
    Accessibility: '- It is accessible.',
  },
  sourceUrl: 'https://example.test/Thing.tsx',
  hasMobile: false,
  ...overrides,
})

const indexOfText = (page, text) => {
  const index = page.indexOf(text)
  assert.notStrictEqual(index, -1, `expected the page to contain ${text}`)
  return index
}

describe('web page: Overview story', () => {
  const stories = [
    story('Overview'),
    story('Sizes', { caption: 'Two sizes.' }),
    story('Tones', { caption: 'Two tones.' }),
  ]
  const page = renderWeb('Thing', context(stories))

  test('is shown once, right after Features and before Usage', () => {
    const overview = indexOfText(page, '<Canvas of={Stories.Overview} />')
    assert.strictEqual(page.split('Stories.Overview').length - 1, 1)
    assert.ok(indexOfText(page, '## Features') < overview)
    assert.ok(overview < indexOfText(page, '## Usage'))
  })

  test('is not listed under Examples', () => {
    const examples = page.slice(indexOfText(page, '## Examples'))
    assert.ok(!examples.includes('Overview'))
  })

  test('leaves the other stories under Examples in order, with captions', () => {
    const examples = page.slice(indexOfText(page, '## Examples'))
    const sizes = indexOfText(examples, '### Sizes')
    const tones = indexOfText(examples, '### Tones')
    assert.ok(sizes < tones)
    assert.ok(examples.includes('Two sizes.'))
    assert.ok(examples.includes('Two tones.'))
  })

  test('has no heading and no caption of its own', () => {
    const overview = story('Overview', { caption: 'Never shown.' })
    const withCaption = renderWeb('Thing', context([overview, story('Sizes')]))
    assert.ok(!withCaption.includes('### Overview'))
    assert.ok(!withCaption.includes('Never shown.'))
  })

  test('does not have to be the first story in the file', () => {
    const reordered = renderWeb(
      'Thing',
      context([story('Sizes'), story('Overview')]),
    )
    assert.ok(
      indexOfText(reordered, '<Canvas of={Stories.Overview} />') <
        indexOfText(reordered, '## Usage'),
    )
    assert.ok(
      indexOfText(reordered, '### Sizes') > indexOfText(reordered, '## Props'),
    )
  })
})

describe('web page: rules that stop the build', () => {
  test('fails with a clear message when there is no Overview story', () => {
    assert.throws(
      () => renderWeb('Thing', context([story('Sizes')])),
      (error) =>
        error instanceof DocsError &&
        error.message.includes('add an Overview story to Thing.stories.tsx'),
    )
  })

  test('fails when Overview is the only story, because there are no Examples', () => {
    assert.throws(
      () => renderWeb('Thing', context([story('Overview')])),
      (error) =>
        error instanceof DocsError && error.message.includes('no Examples'),
    )
  })
})

describe('mobile page: Overview is not special', () => {
  test('a story called Overview is listed as an ordinary example', () => {
    const page = renderMobile(
      'Thing',
      context([story('Overview'), story('Sizes')]),
    )
    assert.ok(page.includes('### Overview'))
    assert.ok(page.includes('### Sizes'))
  })
})
