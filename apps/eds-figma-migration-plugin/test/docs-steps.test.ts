/**
 * The docs pages about the plugin show images of the demo at named steps,
 * and `pnpm run docs:sync` copies those images into the docs site. When a
 * step is renamed or removed in the demo, the page would keep an image that
 * no build can make again, so every step a page names must be one the demo
 * has.
 */
import { describe, expect, it } from 'vitest'
import { STEPS } from '../demo/src/step-names'
import { docsSteps, stepsInPage } from '../scripts/docs-steps.mjs'

const PAGE = `import { PluginStep } from '@site/src/components/MigrationPlugin/MigrationPlugin'

<PluginStep step="scan" alt="The window before a scan.">

Choose what to scan.

</PluginStep>

<PluginStep
  step="manual-fix"
  alt="A Manual fix."
>
`

describe('reading the steps of a docs page', () => {
  it('finds each step a page names', () => {
    expect(stepsInPage(PAGE)).toEqual(['scan', 'manual-fix'])
  })

  it('finds none in a page without the plugin components', () => {
    expect(stepsInPage('<Tabs step="one" />')).toEqual([])
  })
})

describe('docs pages and the demo', () => {
  // No page shows the demo until the docs pages are merged, so this can be
  // empty; the tests above check that the pages are read.
  const steps = docsSteps()

  it.skipIf(steps.length > 0)('no docs page shows the demo yet', () => {
    expect(steps).toEqual([])
  })

  it.each(steps)('the demo has the step "$step"', ({ step, pages }) => {
    expect(
      STEPS as readonly string[],
      `${pages.join(', ')} shows the step "${step}"`,
    ).toContain(step)
  })
})
