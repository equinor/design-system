/**
 * The window's words, from the plugin's labels with the changes from the UX
 * review (F5): values are counted as values, and the category for legacy
 * variables inside instances is called Inside instances.
 */
import {
  CATEGORY_DESCRIPTIONS as PLUGIN_DESCRIPTIONS,
  CATEGORY_LABELS as PLUGIN_LABELS,
} from '../scan/labels'
import type { MappingGroup, MappingRow } from '../scan/mapping'
import type { Category, ComponentSource } from '../scan/types'

export { GROUP_LABELS, KEPT_TARGET_LABEL, propertyLabel } from '../scan/labels'

export const CATEGORY_LABELS: Record<Category, string> = {
  ...PLUGIN_LABELS,
  inInstance: 'Inside instances',
}

export const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  ...PLUGIN_DESCRIPTIONS,
  none: 'A legacy variable the EDS Beta has no token for, such as a stroke width on a padding or a palette colour. It shows a gap in the tokens, and the report lists it. The plugin proposes a stand-in, such as the spacing token with the same px or the nearest colour for the layer, and Apply changes the value only once you choose the stand-in or another target, in Changes or in Review. A legacy mode marked Waiting counts here too: Apply clears it once no layer below it uses legacy variables, and its row says what it waits for, such as a value below set to Decide later.',
  inInstance:
    'A legacy variable an instance takes from its main component. The plugin does not change it in the instance, because a change there becomes an override. A component in this file changes every instance once its main component is migrated. The plugin migrates variables, not components: swap an instance of a library component to an EDS Beta component in Figma, and its legacy values go with it. A value the instance overrides itself is listed with the other changes.',
}

/**
 * Where a value inside an instance comes from: the instance overrides it,
 * so the plugin can change it there, or it takes it from its main component
 * and changes with that.
 */
export type ValueOrigin = 'override' | 'main'

export const ORIGIN_LABELS: Record<ValueOrigin, string> = {
  override: 'Overridden in the instance',
  main: 'From the main component',
}

/**
 * A layer that is hidden, or is in a hidden layer. Figma draws no box around
 * it, so Go to selects it in the Layers panel and shows the layer it is in.
 */
export const HIDDEN_LABEL = 'Hidden'

/**
 * A legacy mode that is only cleared and that the next Apply keeps, because
 * values below it that read it are not changed in that run (mapping.ts,
 * isKeptWaiting). It counts as No equivalent, but it has a change, clearing
 * the mode, that waits for the layers below, so its badge says Waiting.
 */
export const HELD_LABEL = 'Waiting'

/** `kept` is true for a legacy mode the next Apply keeps (isKeptWaiting). */
export function isHeld(category: Category, kept = false): boolean {
  return category === 'none' && kept
}

/** The status shown on one binding or row: its category, or Waiting for a kept mode. */
export function statusLabel(category: Category, kept = false): string {
  return isHeld(category, kept) ? HELD_LABEL : CATEGORY_LABELS[category]
}

/** “1 value”, “14 values” */
export function values(count: number): string {
  return `${count} value${count === 1 ? '' : 's'}`
}

/** “1 instance”, “4 instances” */
export function plural(count: number, one: string, many = `${one}s`): string {
  return `${count} ${count === 1 ? one : many}`
}

/**
 * The legacy side of a row in words (final review FR2 and FR3): typography as
 * “UI body, sm, Regular, squished” instead of the variable names, and a mode
 * with its collection, “Appearance: Danger”. With the row, typography is
 * what the rules read from the row's values (BindingRecord.oldTypography),
 * so rows that bind the same variables in other modes, as every Typography
 * instance does, are told apart (test session 2, 2026-11-25).
 */
export function legacyText(group: MappingGroup, row?: MappingRow): string {
  if (group.group === 'typography') {
    const read = [
      ...new Set(
        (row?.bindings ?? [])
          .map((binding) => binding.oldTypography)
          .filter((text): text is string => Boolean(text)),
      ),
    ]
    if (read.length > 0) return read.join('; ')
    const names = group.old.split(', ')
    const family = names.some((name) => name.includes('/header/'))
      ? 'Header'
      : 'UI body'
    const step = names
      .map((name) => /\/([a-z0-9]+)\/font-size/.exec(name)?.[1])
      .find(Boolean)
    const lineHeight = names
      .map((name) => /line-height-(\w+)/.exec(name)?.[1])
      .find(Boolean)
    const weight = names.some((name) => name.includes('font-weight-bolder'))
      ? 'bolder'
      : undefined
    return [family, step, lineHeight, weight].filter(Boolean).join(', ')
  }
  if (group.group === 'modes' && group.oldCollection) {
    const collection = group.oldCollection.replace(/^[^\p{L}]+/u, '')
    return `${collection}: ${group.old}`
  }
  return group.old
}

/** What the values of a row are on. */
export type RowNoun = 'layers' | 'instances'

const ONE: Record<RowNoun, string> = { layers: 'layer', instances: 'instance' }

/**
 * The accessible names of a row's controls, with the row's legacy side as
 * the row shows it, and in the singular for one value (test session 2: “Go
 * to the 1 instances that use …”).
 */
export function rowLabels(
  legacy: string,
  count: number,
  noun: RowNoun = 'layers',
): { select: string; goTo: string; show: string; hide: string } {
  const what = count === 1 ? ONE[noun] : noun
  const use = count === 1 ? 'uses' : 'use'
  return {
    select: `Select the ${values(count)} that ${use} ${legacy}`,
    goTo: `Go to the ${count} ${what} that ${use} ${legacy}`,
    show: `Show the ${what} that ${use} ${legacy}`,
    hide: `Hide the ${what} that ${use} ${legacy}`,
  }
}

/**
 * Where the legacy values an instance takes from its main component can be
 * fixed (phase 3, 2026-11-20): the short label on the instance's row, and the
 * title and advice of its group in Where to fix them on the Instances tab.
 */
export const SOURCES: Record<
  ComponentSource['kind'],
  { label: string; title: string; advice: string }
> = {
  update: {
    label: 'Update',
    title: 'Library update available',
    advice:
      'Accept the updates in Figma, with Review library updates at the top of the left sidebar.',
  },
  library: {
    label: 'Library',
    title: 'Current library version',
    advice:
      "The library's current version still uses legacy variables. Swap these instances to EDS Beta components in Figma.",
  },
  'this-file': {
    label: 'This file',
    title: 'In this file',
    advice:
      'Migrate the main components on the Main components tab, and the instances follow.',
  },
  'no-library': {
    label: 'No library',
    title: 'Not in a library',
    advice:
      'No library this file reaches has the main component: it is from another file, or its library no longer publishes it. Swap the instances to EDS Beta components, migrate the main component in its own file, or detach the instances.',
  },
  failed: {
    label: 'Not checked',
    title: 'Not checked',
    advice: 'The check could not read these. Scan again and check again.',
  },
}

/**
 * What Changes says when nothing is left for it (phase 4 of the
 * nested-instances plan, 2026-11-20). With values left inside instances it
 * says how many and where to find them: "Nothing left to migrate" read as
 * done while a pasted panel component still had 638 legacy values inside
 * instances.
 */
export function nothingLeftText(inInstances: number, where: string): string {
  if (inInstances === 0) return `Nothing left to migrate ${where}.`
  const one = inInstances === 1
  return `Nothing left to change ${where}. ${inInstances} legacy value${one ? ' is' : 's are'} left inside instances; the Instances tab shows where to fix ${one ? 'it' : 'them'}.`
}
