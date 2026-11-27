/** The modules the demo's Vite config makes (demo/vite-plugins.ts). */
declare module 'virtual:demo-window' {
  /** The plugin window as one HTML document, built as dist/ui.html is */
  export const windowHtml: string
}

declare module 'virtual:demo-fixtures' {
  /** The test frame, with new layer and variable ids, as a PackedFixture */
  export const wellOverview: unknown
  /** The frame with the details panel, with new layer and variable ids, as a PackedFixture */
  export const detailsPanel: unknown
}
