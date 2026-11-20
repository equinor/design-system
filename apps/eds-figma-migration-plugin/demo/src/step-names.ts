/**
 * The names of the steps the demo can open at (`?step=`). They are in a
 * module of their own, with no DOM code, so the test that checks the docs
 * pages against them can import them in Node.
 */
export const STEPS = [
  /** The window as it opens, before a scan */
  'scan',
  /** After a scan of the page: the health of the sample file */
  'health',
  /** The Changes tab */
  'changes',
  /** Review, with the first value that needs a check open for a decision */
  'review',
  /** After Apply: what the run did, and the health after it */
  'apply',
  /** A frame after Apply, with the confirmation of Revert frame open */
  'revert',
  /** The Instances tab, with the tree of the instances that hold legacy values */
  'instances',
  /** The Instances tab after Check for library updates: where to fix them */
  'sources',
  /** The Size tab of Changes, with the Manual fix and its layer open */
  'manual-fix',
  /** The Typography tab of Changes, with the instances Convert replaces */
  'typography',
  /** What the categories of the health bar mean, in their dialog */
  'statuses',
  /** The Modes tab of Changes, with the legacy modes */
  'modes',
  /** The introduction, as the plugin shows it on the first open */
  'intro',
] as const

export type Step = (typeof STEPS)[number]

export function isStep(value: string | null): value is Step {
  return (STEPS as readonly (string | null)[]).includes(value)
}
