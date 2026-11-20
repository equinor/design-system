/**
 * The steps the demo can open at (`?step=`), for the docs pages and their
 * images. The page gets to a step the way a designer would: it clicks the
 * window's controls, found by role and accessible name, and the stand-in for
 * the main thread answers as the plugin does. Nothing in the window knows
 * about the demo. When a control is renamed or moved, the step fails here
 * and in the image script, instead of showing the wrong view.
 */
import { configure, waitFor, within } from '@testing-library/dom'
import type { BoundFunctions, queries } from '@testing-library/dom'

import type { Step } from './step-names'

export { STEPS, isStep } from './step-names'
export type { Step } from './step-names'

configure({ asyncUtilTimeout: 20000 })

type Ui = BoundFunctions<typeof queries>

function press(element: HTMLElement) {
  element.click()
}

async function tab(ui: Ui, name: RegExp) {
  const found = await ui.findByRole('tab', { name })
  press(found)
  await waitFor(() => {
    if (found.getAttribute('aria-selected') !== 'true') {
      throw new Error(`The tab ${found.textContent ?? ''} is not selected`)
    }
  })
}

/**
 * Scrolls the window so the element is at its top, as a designer scrolls to
 * a list. The window's own document is scrolled, never the page around the
 * demo, which scrollIntoView would move too.
 */
function reveal(document: Document, element: HTMLElement, margin = 8) {
  const scroller = document.scrollingElement ?? document.documentElement
  const top = element.getBoundingClientRect().top + scroller.scrollTop - margin
  scroller.scrollTo({ top, behavior: 'instant' })
}

/** Scans the page from the first view, and waits for the overview after the end of the scan. */
async function firstScan(ui: Ui) {
  press(await ui.findByRole('button', { name: 'Scan' }))
  await ui.findByRole('tablist', { name: 'View' })
}

/** Waits until the scan after a run has ended and its results are in. */
async function rescanned(document: Document) {
  await waitFor(() => {
    if (document.querySelector('.results[data-updating]')) {
      throw new Error('The scan after the run has not ended')
    }
  })
}

async function apply(ui: Ui, document: Document) {
  await firstScan(ui)
  press(await ui.findByRole('button', { name: /^Apply \d+$/ }))
  const dialog = within(await ui.findByRole('dialog'))
  // Apply in the confirmation waits for the plugin's preview of the run.
  const confirm = await dialog.findByRole('button', { name: 'Apply' })
  await waitFor(() => {
    if ((confirm as HTMLButtonElement).disabled) {
      throw new Error('The preview of the run has not come')
    }
  })
  press(confirm)
  await ui.findByText(/on \d+ layers?\./)
  await rescanned(document)
}

async function changes(ui: Ui) {
  await firstScan(ui)
  await tab(ui, /^Changes$/)
}

/** A tab of Changes, scrolled to the top of the window. */
async function changesTab(ui: Ui, document: Document, name: RegExp) {
  await changes(ui)
  await tab(ui, name)
  reveal(document, await ui.findByRole('tablist', { name: 'Kind of value' }), 0)
}

/** A tab of the overview, scrolled to the top of the window. */
async function viewTab(ui: Ui, document: Document, name: RegExp) {
  await firstScan(ui)
  await tab(ui, name)
  reveal(document, await ui.findByRole('tablist', { name: 'View' }))
}

const DRIVERS: Record<Step, (ui: Ui, document: Document) => Promise<void>> = {
  scan: async (ui) => {
    await ui.findByRole('button', { name: 'Scan' })
  },
  health: async (ui) => {
    await firstScan(ui)
  },
  changes: async (ui, document) => {
    await viewTab(ui, document, /^Changes$/)
  },
  review: async (ui) => {
    await firstScan(ui)
    press(await ui.findByRole('button', { name: /^Review \d+ ⚠$/ }))
    await ui.findByRole('button', { name: 'Stop review' })
  },
  apply,
  revert: async (ui, document) => {
    await apply(ui, document)
    const [open] = await ui.findAllByRole('button', {
      name: 'Open Well overview',
    })
    press(open)
    press(await ui.findByRole('button', { name: 'Revert frame' }))
    await ui.findByRole('heading', {
      name: 'Revert the changes in this frame?',
    })
  },
  instances: async (ui, document) => {
    await viewTab(ui, document, /^Instances \d+$/)
    const tree = within(await ui.findByRole('list', { name: 'Instances' }))
    // Opens the details panel in the tree, so the instances in it show.
    press(
      await tree.findByRole('button', {
        name: 'Show the layers in Details panel',
      }),
    )
    await tree.findByRole('button', {
      name: 'Hide the layers in Details panel',
    })
    reveal(document, await ui.findByRole('tablist', { name: 'View' }))
  },
  sources: async (ui, document) => {
    await viewTab(ui, document, /^Instances \d+$/)
    press(await ui.findByRole('button', { name: 'Check for library updates' }))
    await ui.findByRole('button', { name: 'Check again' })
    await ui.findByRole('heading', { name: 'Where to fix them' })
    reveal(document, await ui.findByRole('tablist', { name: 'View' }))
  },
  'manual-fix': async (ui, document) => {
    await changesTab(ui, document, /^Size \d+$/)
    const status = within(await ui.findByRole('group', { name: 'Status' }))
    press(await status.findByRole('button', { name: /^Manual fix \d+$/ }))
    press(
      await ui.findByRole('button', {
        name: /^Show the \w+ that use Selectable\/Icon size$/,
      }),
    )
    await ui.findAllByText(/^Resetting the layer also removes these/)
    reveal(
      document,
      await ui.findByRole('tablist', { name: 'Kind of value' }),
      0,
    )
  },
  typography: async (ui, document) => {
    await changesTab(ui, document, /^Typography \d+$/)
    await ui.findByRole('button', { name: /^Convert \d+ to text$/ })
  },
  statuses: async (ui) => {
    await firstScan(ui)
    const [legend] = await ui.findAllByRole('button', {
      name: 'What the categories mean',
    })
    press(legend)
    await ui.findByRole('heading', { name: 'What the categories mean' })
  },
  modes: async (ui, document) => {
    await changesTab(ui, document, /^Modes \d+$/)
  },
  intro: async (ui) => {
    await ui.findByRole('dialog')
  },
}

/** Gets the window in `document` to the step. Throws when a control or view is not found. */
export async function goTo(step: Step, document: Document): Promise<void> {
  await DRIVERS[step](within(document.body), document)
}
