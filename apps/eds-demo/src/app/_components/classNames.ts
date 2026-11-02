import structure from './structure.module.css'

/** The class names of a page's tokens.module.css. */
export type Styles = Readonly<Record<string, string>>

/**
 * Every element gets two classes with the same name: one from the shared
 * structure.module.css (layout) and one from the page's tokens.module.css
 * (every token decision). The solution and the exercise differ only in the
 * second file.
 */
export function classNames(styles: Styles) {
  return (name: string) =>
    [structure[name], styles[name]].filter(Boolean).join(' ')
}
