/**
 * Tests for .claude/hooks/pr_flow_hook.js, the hook that hands the agent the
 * matching part of PR_REVIEWS.md when it runs a pull request command.
 *
 * What is worth pinning down is which commands trigger it, and that every
 * section it names still exists in the document. The hook is also run as a
 * subprocess with the input Claude Code sends, so the test sees the contract
 * Claude Code sees: JSON on stdout, or nothing. The `git push` case is left
 * out of the subprocess runs because it asks GitHub for the PR's state.
 * Node's own runner: `pnpm run test:scripts`.
 */

const { test, describe } = require('node:test')
const assert = require('node:assert')
const { execFileSync } = require('node:child_process')
const { randomUUID } = require('node:crypto')
const { readFileSync, rmSync, utimesSync } = require('node:fs')
const { tmpdir } = require('node:os')
const { join } = require('node:path')

const {
  EVENTS,
  classify,
  section,
} = require('../.claude/hooks/pr_flow_hook.js')

const root = join(__dirname, '..')
const hook = join(root, '.claude/hooks/pr_flow_hook.js')
const doc = readFileSync(
  join(root, 'documentation/agent-instructions/PR_REVIEWS.md'),
  'utf8',
)

// Each call is a new session unless one is given, because the hook remembers
// per session that it has already sent the board rules.
const runHook = (command, toolName = 'Bash', sessionId = randomUUID()) =>
  execFileSync('node', [hook], {
    input: JSON.stringify({
      tool_name: toolName,
      tool_input: { command },
      session_id: sessionId,
    }),
    env: { ...process.env, CLAUDE_PROJECT_DIR: root },
    encoding: 'utf8',
  })

describe('classify', () => {
  test('matches the pull request commands', () => {
    assert.deepStrictEqual(classify('git push origin my-branch'), ['push'])
    assert.deepStrictEqual(classify('git push -u origin HEAD'), ['push'])
    assert.deepStrictEqual(classify('gh pr create --title "x"'), ['open'])
    assert.deepStrictEqual(classify('gh pr ready 5935'), ['open'])
    assert.deepStrictEqual(classify('gh pr ready --undo'), ['open'])
    assert.deepStrictEqual(classify('gh pr review 5935 --comment'), ['review'])
    assert.deepStrictEqual(
      classify('gh api repos/equinor/design-system/pulls/5935/reviews -X POST'),
      ['review'],
    )
    assert.deepStrictEqual(classify('gh pr edit 5935 --add-reviewer someone'), [
      'claim',
    ])
  })

  test('matches a command inside a chain', () => {
    assert.deepStrictEqual(
      classify('git add . && git commit -m "fix" && git push'),
      ['push'],
    )
    assert.deepStrictEqual(
      classify('git push -u origin HEAD && gh pr create --fill'),
      ['push', 'open'],
    )
  })

  test('ignores everything else', () => {
    assert.deepStrictEqual(classify('ls -la'), [])
    assert.deepStrictEqual(classify('git status'), [])
    assert.deepStrictEqual(classify('git commit -m "fix"'), [])
    assert.deepStrictEqual(classify('gh pr view 5935'), [])
    assert.deepStrictEqual(classify('gh pr edit 5935 --title "x"'), [])
    assert.deepStrictEqual(classify('gh issue create'), [])
    assert.deepStrictEqual(classify('pnpm run build'), [])
  })
})

describe('sections', () => {
  test('every section the hook names exists in PR_REVIEWS.md', () => {
    for (const [name, { sections }] of Object.entries(EVENTS)) {
      for (const heading of sections) {
        const text = section(doc, heading)
        assert.ok(text, `${name}: no "## ${heading}" section in PR_REVIEWS.md`)
        assert.ok(text.length > heading.length + 10, `${heading} is empty`)
      }
    }
  })

  test('a section stops at the next heading', () => {
    const text = section('## A\nfirst\n\n## B\nsecond', 'A')
    assert.strictEqual(text, '## A\nfirst')
  })

  test('returns null for a missing heading', () => {
    assert.strictEqual(section('## A\nfirst', 'B'), null)
  })
})

describe('hook', () => {
  test('hands over the board rules when a PR is created', () => {
    const output = JSON.parse(runHook('gh pr create --title "x"'))
    assert.strictEqual(output.hookSpecificOutput.hookEventName, 'PreToolUse')
    const context = output.hookSpecificOutput.additionalContext
    assert.match(context, /## After every push/)
    assert.match(context, /## The board/)
  })

  test('hands over the review rules when a review is posted', () => {
    const output = JSON.parse(runHook('gh pr review 5935 --comment'))
    const context = output.hookSpecificOutput.additionalContext
    assert.match(context, /## Recommend a type/)
    assert.match(context, /## Put the review in/)
  })

  test('sends the board rules once per session, then only the checklist', () => {
    const sessionId = randomUUID()
    try {
      const first = JSON.parse(runHook('gh pr ready', 'Bash', sessionId))
      const second = JSON.parse(runHook('gh pr ready', 'Bash', sessionId))
      assert.match(first.hookSpecificOutput.additionalContext, /## The board/)
      const context = second.hookSpecificOutput.additionalContext
      assert.doesNotMatch(context, /## The board/)
      assert.match(context, /## After every push/)
    } finally {
      rmSync(join(tmpdir(), `pr-flow-hook-${sessionId.replace(/\W/g, '')}`), {
        force: true,
      })
    }
  })

  test('sends the board rules again when the earlier ones are 30 minutes old', () => {
    const sessionId = randomUUID()
    const marker = join(
      tmpdir(),
      `pr-flow-hook-${sessionId.replace(/\W/g, '')}`,
    )
    try {
      runHook('gh pr ready', 'Bash', sessionId)
      const old = new Date(Date.now() - 31 * 60 * 1000)
      utimesSync(marker, old, old)
      const again = JSON.parse(runHook('gh pr ready', 'Bash', sessionId))
      assert.match(again.hookSpecificOutput.additionalContext, /## The board/)
    } finally {
      rmSync(marker, { force: true })
    }
  })

  test('says nothing for other commands and other tools', () => {
    assert.strictEqual(runHook('ls -la'), '')
    assert.strictEqual(runHook('gh pr create', 'Edit'), '')
  })

  test('does not fail on input it cannot read', () => {
    const output = execFileSync('node', [hook], {
      input: 'not json',
      encoding: 'utf8',
    })
    assert.strictEqual(output, '')
  })
})
