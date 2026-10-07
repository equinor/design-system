#!/usr/bin/env node

/**
 * Generates the Storybook docs page for a component on both platforms from
 * the same inputs. With no component name it processes every component that
 * has a web sidecar.
 *
 *   node scripts/generate-component-docs.js [Component...] [--check]
 *
 * Inputs, per platform (web = eds-core-react /next, mobile = eds-mobile-components).
 * They live in the folder that holds {Component}.tsx, which is not always a
 * folder of the same name (mobile Checkbox, Radio and Switch share
 * SelectionControls/):
 *   {Component}Props        a `type` or `interface` in any file of that folder:
 *                           props, types, defaults, descriptions (JSDoc)
 *   {Component}.stories.tsx example code and captions
 *   {Component}.docs.md     the hand-written part: Summary, Usage,
 *                           Accessibility, Related components, and an optional
 *                           Links section (WAI-ARIA pattern, shared docs page)
 *   {Component}.figma.tsx   Figma URL (web folder only, optional)
 *
 * Outputs:
 *   web:    next/{Component}/{Component}.docs.mdx  (attached MDX, both tabs)
 *   mobile: eds-mobile-components/docs/{Component}.mdx (plain markdown, the
 *           React Native tab)
 *
 * `--check` regenerates in memory and exits 1 if a committed file is stale,
 * the same contract as generate-component-index.js.
 *
 * The code lives in scripts/component-docs/.
 */

require('./component-docs').run(process.argv.slice(2))
