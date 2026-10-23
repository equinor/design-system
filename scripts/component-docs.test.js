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
    const withCaption = renderWeb(
      'Thing',
      context([overview, story('Sizes', { caption: 'Two sizes.' })]),
    )
    assert.ok(!withCaption.includes('### Overview'))
    assert.ok(!withCaption.includes('Never shown.'))
  })

  test('does not have to be the first story in the file', () => {
    const reordered = renderWeb(
      'Thing',
      context([story('Sizes', { caption: 'Two sizes.' }), story('Overview')]),
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
      context([
        story('Overview', { caption: 'An overview.' }),
        story('Sizes', { caption: 'Two sizes.' }),
      ]),
    )
    assert.ok(page.includes('### Overview'))
    assert.ok(page.includes('### Sizes'))
  })
})

describe('mobile page: sub-components', () => {
  const sub = {
    name: 'Thing.Icon',
    props: [
      {
        name: 'name',
        optional: false,
        type: 'string',
        default: undefined,
        description: 'Name of the icon.',
      },
    ],
  }

  test('each gets its own props table under Props, before Examples', () => {
    const page = renderMobile(
      'Thing',
      context([story('Sizes', { caption: 'Two sizes.' })], {
        subComponents: [sub],
      }),
    )
    assert.ok(page.includes('### Thing.Icon\n\n| Prop | Type |'))
    assert.ok(page.indexOf('### Thing.Icon') < page.indexOf('## Examples'))
  })

  test('a sub-component without props says so instead of printing an empty table', () => {
    const page = renderMobile(
      'Thing',
      context([story('Sizes', { caption: 'Two sizes.' })], {
        subComponents: [{ name: 'Thing.Icon', props: [] }],
      }),
    )
    assert.ok(page.includes('Thing.Icon has no props of its own.'))
    assert.ok(!page.includes('| Prop | Type |'))
  })

  test('a page without sub-components has no extra heading', () => {
    const page = renderMobile(
      'Thing',
      context([story('Sizes', { caption: 'Two sizes.' })]),
    )
    assert.ok(!page.includes('### Thing.Icon'))
  })
})

describe('mobile page: React Native base types', () => {
  const render = (overrides) =>
    renderMobile(
      'Thing',
      context([story('Sizes', { caption: 'Two sizes.' })], overrides),
    )

  const base = (name, omitted = []) => ({ name, omitted })

  test('names the type under the props table, linked to its docs', () => {
    const page = render({ baseTypes: [base('PressableProps')] })
    assert.ok(
      page.includes(
        'Also accepts all React Native [`PressableProps`](https://reactnative.dev/docs/pressable#props).',
      ),
    )
    assert.ok(page.indexOf('Also accepts') < page.indexOf('## Examples'))
  })

  test('joins two types with "and"', () => {
    const page = render({ baseTypes: [base('ViewProps'), base('TextProps')] })
    assert.ok(
      page.includes(
        '[`ViewProps`](https://reactnative.dev/docs/view#props) and [`TextProps`](https://reactnative.dev/docs/text#props).',
      ),
    )
  })

  test('names a type that has no docs entry without a link', () => {
    const page = render({ baseTypes: [base('ScrollViewProps')] })
    assert.ok(page.includes('Also accepts all React Native `ScrollViewProps`.'))
  })

  test('says which props an Omit took out, so it does not claim all of them', () => {
    const page = render({
      baseTypes: [
        base('TextInputProps', ['onChange', 'onChangeText', 'readOnly']),
      ],
    })
    assert.ok(
      page.includes(
        '[`TextInputProps`](https://reactnative.dev/docs/textinput#props), except `onChange`, `onChangeText` and `readOnly`.',
      ),
    )
  })

  test('names a single omitted prop without "and"', () => {
    const page = render({ baseTypes: [base('ViewProps', ['style'])] })
    assert.ok(page.includes(', except `style`.'))
  })

  test('does not name an omitted prop that the table declares itself', () => {
    const declared = (name) => ({
      name,
      optional: true,
      type: 'string',
      default: undefined,
      description: 'Declared by the component.',
    })
    const page = render({
      props: [declared('onChange'), declared('readOnly')],
      baseTypes: [
        base('TextInputProps', ['onChange', 'onChangeText', 'readOnly']),
      ],
    })
    assert.ok(page.includes(', except `onChangeText`.'))
    assert.ok(!page.includes('except `onChange`'))
  })

  test('drops the except clause when every omitted prop is declared', () => {
    const page = render({
      props: [
        {
          name: 'onChange',
          optional: true,
          type: 'string',
          default: undefined,
          description: 'Declared by the component.',
        },
      ],
      baseTypes: [base('TextInputProps', ['onChange'])],
    })
    assert.ok(
      page.includes(
        'Also accepts all React Native [`TextInputProps`](https://reactnative.dev/docs/textinput#props).',
      ),
    )
  })

  test('says nothing when every prop is listed', () => {
    assert.ok(!render({}).includes('Also accepts'))
  })

  test('a sub-component gets its own line under its own table', () => {
    const page = render({
      subComponents: [
        { name: 'Thing.Icon', props: [], baseTypes: [base('PressableProps')] },
      ],
    })
    assert.strictEqual(page.split('Also accepts').length - 1, 1)
    assert.ok(page.indexOf('### Thing.Icon') < page.indexOf('Also accepts'))
  })
})

describe('every example needs a caption', () => {
  test('web fails with a clear message, listing every example missing one', () => {
    assert.throws(
      () =>
        renderWeb(
          'Thing',
          context([
            story('Overview'),
            story('Sizes'),
            story('Tones', { caption: 'Two tones.' }),
            story('Colours'),
          ]),
        ),
      (error) =>
        error instanceof DocsError &&
        error.message.includes('add a caption to `Sizes`, `Colours`'),
    )
  })

  test('web does not require a caption on Overview itself', () => {
    const page = renderWeb(
      'Thing',
      context([story('Overview'), story('Sizes', { caption: 'Two sizes.' })]),
    )
    assert.ok(page.includes('### Sizes'))
  })

  test('mobile fails with the same message when an example has none', () => {
    assert.throws(
      () => renderMobile('Thing', context([story('Sizes')])),
      (error) =>
        error instanceof DocsError &&
        error.message.includes('add a caption to `Sizes`'),
    )
  })
})
