/**
 * Tests for the two checks that keep the breaking changes page honest.
 *
 * What is worth pinning down here is the rules, not the plumbing: which files
 * count as a component's surface, when the escape hatches apply, and how the
 * page is parsed. `fetchChangedFiles` and `gh pr view` are left alone, since
 * they only fetch what these rules then judge.
 *
 * The doc check runs as a subprocess with CHANGED_FILES set, so the test sees
 * the contract CI sees - an exit code and a message - without the script
 * needing to be restructured for it. Node's own runner, so no new dependency:
 * `pnpm run test:scripts`.
 */

const { test, describe } = require('node:test')
const assert = require('node:assert')
const { execFileSync } = require('node:child_process')
const { join } = require('node:path')

const {
  exportedComponents,
  sections,
  isEmpty,
} = require('./check-breaking-changes-coverage')

const DOC_CHECK = join(__dirname, 'check-breaking-changes-doc.js')
const NEXT = 'packages/eds-core-react/src/components/next'
const PAGE = 'packages/eds-core-react/stories/docs/BreakingChanges.mdx'

/** Runs the doc check and returns its exit code and output. A non-zero exit is
 * the point of several cases, so the failure is captured rather than thrown. */
const run = ({ title = 'fix: something', files = [], ...rest }) => {
  const env = {
    ...process.env,
    PR_NUMBER: '1',
    PR_TITLE: title,
    PR_BODY: rest.body || '',
    PR_LABELS: rest.labels || '',
    PR_AUTHOR: rest.author || 'pomfrida',
    CHANGED_FILES: files.join('\n'),
  }
  try {
    return {
      code: 0,
      out: execFileSync('node', [DOC_CHECK], { env, encoding: 'utf8' }),
    }
  } catch (error) {
    return { code: error.status, out: error.stdout || '' }
  }
}

describe('breaking changes page entry', () => {
  describe('a published component changed', () => {
    const cases = [
      ['a component .tsx', [`${NEXT}/Button/Button.tsx`]],
      ['a .types.ts', [`${NEXT}/Button/Button.types.ts`]],
      // #5564 changed this and nothing else of substance. A rule reading only
      // .tsx and .types.ts let it through.
      ['a hook in a component directory', [`${NEXT}/Field/useFieldIds.ts`]],
      ['a per-component barrel', [`${NEXT}/Button/index.ts`]],
      ['shared code', [`${NEXT}/utils/selectOptions.ts`]],
    ]

    for (const [what, files] of cases) {
      test(`fails on ${what}`, () => {
        const { code, out } = run({ files })
        assert.equal(code, 1)
        assert.match(out, /breaking changes page is not in this diff/)
      })
    }

    test('names shared code apart from the components', () => {
      const { out } = run({ files: [`${NEXT}/utils/selectOptions.ts`] })
      assert.match(out, /shared `utils\/`/)
      assert.match(out, /Update the section of every component that uses/)
    })

    test('passes when the page is in the same diff', () => {
      const { code } = run({ files: [`${NEXT}/Button/Button.tsx`, PAGE] })
      assert.equal(code, 0)
    })
  })

  describe('changes the page does not describe', () => {
    const cases = [
      ['CSS alone', [`${NEXT}/Button/button.css`]],
      [
        'tests, stories, Code Connect and snapshots',
        [
          `${NEXT}/Button/Button.test.tsx`,
          `${NEXT}/Button/Button.stories.tsx`,
          `${NEXT}/Button/Button.figma.tsx`,
          `${NEXT}/Button/Button.docs.mdx`,
          `${NEXT}/Button/__snapshots__/Button.test.tsx.snap`,
        ],
      ],
      // Nothing reaches a consumer until the barrel exports it, and the
      // coverage check closes that door.
      [
        'a component the barrel does not export',
        [`${NEXT}/Placeholder/Placeholder.tsx`],
      ],
      ['the /next barrel on its own', [`${NEXT}/index.ts`]],
      [
        'files outside /next',
        ['packages/eds-core-react/src/components/Chip/Chip.tsx'],
      ],
    ]

    for (const [what, files] of cases) {
      test(`passes on ${what}`, () => {
        assert.equal(run({ files }).code, 0)
      })
    }
  })

  describe('marking a PR breaking widens the rule', () => {
    test('CSS alone fails under `fix!`', () => {
      const { code } = run({
        title: 'fix!: drop a custom property',
        files: [`${NEXT}/Button/button.css`],
      })
      assert.equal(code, 1)
    })

    test('a BREAKING CHANGE footer counts as well', () => {
      const { code } = run({
        title: 'fix: tidy up',
        body: 'Some text\n\nBREAKING CHANGE: the size prop is gone',
        files: [`${NEXT}/Button/button.css`],
      })
      assert.equal(code, 1)
    })
  })

  describe('escape hatches', () => {
    test('the skip label passes and leaves a warning annotation', () => {
      const { code, out } = run({
        files: [`${NEXT}/Button/Button.tsx`],
        labels: '["skip-breaking-changes-doc"]',
      })
      assert.equal(code, 0)
      assert.match(out, /::warning::/)
    })

    // #5163 was a group bump that lint-fixed four component files, and
    // Dependabot cannot label its own pull request.
    test('Dependabot is exempt', () => {
      const { code } = run({
        files: [`${NEXT}/Button/Button.tsx`],
        author: 'dependabot[bot]',
      })
      assert.equal(code, 0)
    })

    test('no other bot is exempt', () => {
      const { code } = run({
        files: [`${NEXT}/Button/Button.tsx`],
        author: 'github-actions[bot]',
      })
      assert.equal(code, 1)
    })
  })

  test('says which input is missing when there is no pull request', () => {
    const env = { ...process.env }
    delete env.PR_NUMBER
    delete env.CHANGED_FILES
    try {
      execFileSync('node', [DOC_CHECK], {
        env,
        encoding: 'utf8',
        stdio: 'pipe',
      })
      assert.fail('expected a non-zero exit')
    } catch (error) {
      assert.equal(error.status, 1)
      assert.match(error.stderr, /pass `--pr <number>`/)
    }
  })
})

describe('breaking changes page coverage', () => {
  describe('reading the barrel', () => {
    test('takes the module name, not the exported names', () => {
      const barrel = [
        "export { Menu, MenuItem } from './Menu'",
        "export { Field, useFieldIds } from './Field'",
        "export type { MenuProps } from './Menu'",
      ].join('\n')
      assert.deepEqual(exportedComponents(barrel), ['Field', 'Menu'])
    })

    test('ignores type-only exports', () => {
      const barrel = "export type { BadgeProps, BadgeTone } from './Badge'"
      assert.deepEqual(exportedComponents(barrel), [])
    })

    test('reads a multi-line export list', () => {
      const barrel =
        'export {\n  Dialog,\n  DialogHeader,\n} from ' + "'./Dialog'"
      assert.deepEqual(exportedComponents(barrel), ['Dialog'])
    })

    test('leaves out Slot, which no consumer migrates to', () => {
      const barrel =
        "export { Slot } from './Slot'\nexport { Chip } from './Chip'"
      assert.deepEqual(exportedComponents(barrel), ['Chip'])
    })
  })

  describe('reading the page', () => {
    const page = [
      '## Overview',
      '',
      'A table lives here.',
      '',
      '## Button',
      '',
      'EDS 1.0: `Button`.',
      '',
      '## Chip',
      '',
      '<Tag tone="danger">Known issues</Tag>',
      '',
      '## Known issues',
      '',
      'Framing, not a component.',
    ].join('\n')

    test('skips the headings that structure the page', () => {
      assert.deepEqual(
        sections(page).map((section) => section.name),
        ['Button', 'Chip'],
      )
    })

    test('a heading with only a marker counts as empty', () => {
      const chip = sections(page).find((section) => section.name === 'Chip')
      assert.equal(isEmpty(chip.body), true)
    })

    test('a heading with a sentence does not', () => {
      const button = sections(page).find((section) => section.name === 'Button')
      assert.equal(isEmpty(button.body), false)
    })
  })
})
