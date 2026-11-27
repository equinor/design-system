/** The docs site, next to the plugin in the monorepo */
export declare const DOCS_APP: string

/**
 * The steps one page names, in the order they appear. A page that does not
 * import the plugin's components names none.
 */
export declare function stepsInPage(source: string): string[]

/**
 * Every step a docs page names, with the pages that name it, relative to the
 * docs app. Sorted by step. Empty until a page uses the plugin's images.
 */
export declare function docsSteps(): { step: string; pages: string[] }[]
