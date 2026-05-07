export * from './templates'
export { joinHandlers } from './joinHandlers'
export { mergeRefs } from './mergeRefs'
export { getElementRef } from './getElementRef'
export { setReactInputValue } from './setReactInputValue'
export type { OverridableComponent } from './overridableComponent'
export * from './browserUtils'

export const trimSpaces = (text: string): string => text.replace(/ /g, '')
