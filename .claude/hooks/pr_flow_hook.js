// Hands the agent the matching part of PR_REVIEWS.md at the moment it runs a
// pull request command, so the board and review rules are in front of it when
// it needs them. The rules are written once, in PR_REVIEWS.md: this hook
// decides nothing, it only passes the text on. It never blocks a command.
//
// Runs before every Bash command (PreToolUse). Most commands match nothing and
// the hook exits without output.
const { spawnSync } = require('child_process')
const fs = require('fs')
const os = require('os')
const path = require('path')

const DOC = 'documentation/agent-instructions/PR_REVIEWS.md'

// Matched loosely on the whole command string, because agents chain commands
// (`git add . && git commit && git push`). A reminder that was not needed
// costs a few lines; a push that goes by without one is the failure to avoid.
// The section names must match the `##` headings in PR_REVIEWS.md. The test in
// scripts/pr-flow-hook.test.js fails when one is renamed.
const EVENTS = {
  push: {
    pattern: /\bgit\s+push\b/,
    sections: ['The board', 'After every push'],
  },
  open: {
    pattern: /\bgh\s+pr\s+(create|ready)\b/,
    sections: ['The board', 'After every push'],
  },
  review: {
    pattern:
      /\bgh\s+pr\s+review\b|\bgh\s+api\b[^|;&]*\/pulls\/[^\s|;&]*\/reviews/,
    sections: ['Recommend a type', 'Put the review in'],
  },
  claim: {
    pattern: /\bgh\s+pr\s+edit\b[^|;&]*--add-reviewer/,
    sections: ['Claim the PR and the labels'],
  },
}

function classify(command) {
  return Object.keys(EVENTS).filter((name) =>
    EVENTS[name].pattern.test(command),
  )
}

// The text of one `## heading` section, up to the next `##` heading.
function section(markdown, heading) {
  const lines = markdown.split('\n')
  const start = lines.findIndex((line) => line === `## ${heading}`)
  if (start === -1) return null
  const next = lines.findIndex((line, i) => i > start && line.startsWith('## '))
  return lines
    .slice(start, next === -1 ? lines.length : next)
    .join('\n')
    .trim()
}

// What GitHub says about the PR on this branch, before the command runs. A
// push cancels approvals, so the state has to be read before it. Returns null
// when the branch has no PR yet, and '' when the lookup failed for another
// reason, so the reminder still goes out.
function prFacts(cwd) {
  const result = spawnSync(
    'gh',
    ['pr', 'view', '--json', 'number,isDraft,reviewDecision,latestReviews'],
    { cwd, encoding: 'utf8', timeout: 8000 },
  )
  if (result.status !== 0) {
    return /no pull requests found/i.test(result.stderr || '') ? null : ''
  }
  try {
    const pr = JSON.parse(result.stdout)
    const reviewers = [
      ...new Set(
        (pr.latestReviews || []).map((r) => r.author && r.author.login),
      ),
    ].filter(Boolean)
    return [
      `State of PR #${pr.number} before this command (from GitHub):`,
      `- draft: ${pr.isDraft}`,
      `- review decision: ${pr.reviewDecision || 'none'}`,
      `- reviewers who already reviewed: ${reviewers.join(', ') || 'none'}`,
    ].join('\n')
  } catch {
    return ''
  }
}

const RESEND_AFTER_MS = 30 * 60 * 1000

function isFresh(file) {
  try {
    return Date.now() - fs.statSync(file).mtimeMs < RESEND_AFTER_MS
  } catch {
    return false
  }
}

async function main() {
  const chunks = []
  for await (const chunk of process.stdin) {
    chunks.push(chunk)
  }

  let input
  try {
    input = JSON.parse(Buffer.concat(chunks).toString())
  } catch {
    process.exit(0)
  }
  if (input.tool_name !== 'Bash') process.exit(0)

  const command = (input.tool_input && input.tool_input.command) || ''
  const events = classify(command)
  if (events.length === 0) process.exit(0)

  const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd()
  let markdown
  try {
    markdown = fs.readFileSync(path.join(projectDir, DOC), 'utf8')
  } catch {
    process.exit(0)
  }

  let facts = ''
  if (events.includes('push')) {
    facts = prFacts(input.cwd || projectDir)
    // A push on a branch without a PR moves no card.
    if (facts === null && events.length === 1) process.exit(0)
    facts = facts || ''
  }

  let headings = [...new Set(events.flatMap((e) => EVENTS[e].sections))]

  // The board rules are long. Send them in full the first time in a session,
  // and only the checklist for the next half hour. After that, send them in
  // full again: a long session gets summarised, and the table would be lost.
  const marker = path.join(
    os.tmpdir(),
    `pr-flow-hook-${String(input.session_id || 'none').replace(/\W/g, '')}`,
  )
  if (headings.includes('The board')) {
    if (isFresh(marker)) {
      headings = headings.filter((heading) => heading !== 'The board')
    } else {
      try {
        fs.writeFileSync(marker, '')
      } catch {
        // Best-effort: without the marker the full text is sent every time
      }
    }
  }
  const parts = headings
    .map((heading) => section(markdown, heading))
    .filter(Boolean)
  if (parts.length === 0) process.exit(0)

  const context = [
    `Pull request command detected. These are the rules from ${DOC}. Apply them to the PR you are working on, and finish the steps after the command has run.`,
    facts,
    ...parts,
  ]
    .filter(Boolean)
    .join('\n\n')

  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        additionalContext: context,
      },
    }),
  )
}

if (require.main === module) {
  main().catch(() => process.exit(0))
}

module.exports = { EVENTS, classify, section }
