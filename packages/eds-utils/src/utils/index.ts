export * from './templates'
export { joinHandlers } from './joinHandlers'
export { mergeRefs } from './mergeRefs'
export { setReactInputValue } from './setReactInputValue'
export type { OverridableComponent } from './overridableComponent'

export const trimSpaces = (text: string): string => text.replace(/ /g, '')
