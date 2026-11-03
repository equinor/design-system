import type { Text } from '@codemirror/state'

/** Where you are in the CSS, described by the rule rather than the line
 * number: the exercise and the solution have the same rules in the same
 * order, but their comments and values differ in length. */
export type RuleAnchor = {
  /** The text of the line that opens the rule, such as `.badge {` */
  selector: string
  /** Which occurrence of that line, if it appears more than once */
  occurrence: number
  /** Lines from the opening line to the line you are on */
  offset: number
}

/** A top-level rule opens on a line that starts in column 0 and ends with {. */
function opensRule(line: string) {
  return /^\S.*\{\s*$/.test(line)
}

export function anchorAt(doc: Text, lineNumber: number): RuleAnchor | null {
  for (let number = lineNumber; number >= 1; number--) {
    const text = doc.line(number).text
    if (!opensRule(text)) continue
    const selector = text.trim()
    let occurrence = 0
    for (let earlier = 1; earlier < number; earlier++) {
      const earlierText = doc.line(earlier).text
      if (opensRule(earlierText) && earlierText.trim() === selector)
        occurrence++
    }
    return { selector, occurrence, offset: lineNumber - number }
  }
  return null
}

/** The line in another document that matches the anchor: the same rule, the
 * same number of lines into it, but not past the rule's closing brace. Falls
 * back to the same line number when the rule is not there. */
export function lineFor(
  doc: Text,
  anchor: RuleAnchor | null,
  fallbackLine: number,
): number {
  if (anchor) {
    let seen = 0
    for (let number = 1; number <= doc.lines; number++) {
      const text = doc.line(number).text
      if (!opensRule(text) || text.trim() !== anchor.selector) continue
      if (seen === anchor.occurrence) {
        let end = number
        while (end < doc.lines && doc.line(end).text !== '}') end++
        return Math.min(number + anchor.offset, end)
      }
      seen++
    }
  }
  return Math.min(Math.max(fallbackLine, 1), doc.lines)
}
