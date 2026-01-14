import { mergeWith, pickBy } from 'ramda'
import { DOMAttributes, EventHandler, SyntheticEvent, FocusEvent } from 'react'

const findIndex: IndexFinderType = ({
  calc,
  index,
  optionDisabled,
  availableItems,
}) => {
  const nextItem = availableItems[index]
  if (optionDisabled(nextItem) && index >= 0 && index < availableItems.length) {
    const nextIndex = calc(index)
    return findIndex({ calc, index: nextIndex, availableItems, optionDisabled })
  }
  return index
}

export const findNextIndex: IndexFinderType = ({
  index,
  optionDisabled,
  availableItems,
  allDisabled,
}) => {
  if (allDisabled) return 0
  const options = {
    index,
    optionDisabled,
    availableItems,
    calc: (num: number) => num + 1,
  }
  const nextIndex = findIndex(options)

  if (nextIndex > availableItems.length - 1) {
    // jump to start of list
    return findIndex({ ...options, index: 0 })
  }

  return nextIndex
}

export const findPrevIndex: IndexFinderType = ({
  index,
  optionDisabled,
  availableItems,
  allDisabled,
}) => {
  if (allDisabled) return 0
  const options = {
    index,
    optionDisabled,
    availableItems,
    calc: (num: number) => num - 1,
  }

  const prevIndex = findIndex(options)

  if (prevIndex < 0) {
    // jump to end of list
    return findIndex({ ...options, index: availableItems.length - 1 })
  }

  return prevIndex
}

type IndexFinderType = <T>({
  calc,
  index,
  optionDisabled,
  availableItems,
  allDisabled,
}: {
  index: number
  optionDisabled: (option: T) => boolean
  availableItems: readonly T[]
  allDisabled?: boolean
  calc?: (n: number) => number
}) => number

const isEvent = (val: unknown, key: string) =>
  /^on[A-Z](.*)/.test(key) && typeof val === 'function'

export function mergeEventsFromRight(
  props1: DOMAttributes<unknown>,
  props2: DOMAttributes<unknown>,
) {
  const events1: Partial<DOMAttributes<unknown>> = pickBy(isEvent, props1)
  const events2: Partial<DOMAttributes<unknown>> = pickBy(isEvent, props2)

  return mergeWith(
    (
      event1: EventHandler<SyntheticEvent<unknown>>,
      event2: EventHandler<SyntheticEvent<unknown>>,
    ): EventHandler<SyntheticEvent<unknown>> => {
      return (...args) => {
        event1(...args)
        event2(...args)
      }
    },
    events1,
    events2,
  ) as Partial<DOMAttributes<unknown>>
}

/*When a user clicks the StyledList scrollbar, the input loses focus which breaks downshift
 * keyboard navigation in the list. This code returns focus to the input on mouseUp
 */
export const handleListFocus = (e: FocusEvent<HTMLElement>) => {
  e.preventDefault()
  e.stopPropagation()
  window?.addEventListener(
    'mouseup',
    () => {
      ;(e.relatedTarget as HTMLInputElement)?.focus()
    },
    { once: true },
  )
}
