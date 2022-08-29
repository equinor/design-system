export * from './templates'
export { joinHandlers } from './joinHandlers'
export { mergeRefs } from './mergeRefs'
export { setReactInputValue } from './setReactInputValue'
export type { OverridableComponent } from './overridableComponent'
export { createPolymorphicComponent } from './createPolymorphicComponent'
export type {
  PolymorphicComponentProps,
  PolymorphicRef,
} from './createPolymorphicComponent'

export const trimSpaces = (text: string): string => text.replace(/ /g, '')
