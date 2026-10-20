/**
 * Remembers whether the reader collapsed the desktop doc sidebar, so it starts
 * the same way on the next page load.
 *
 * Restoring it from React alone is too late: the server-rendered page paints
 * with the sidebar open, and once the bundle hydrates the container would
 * animate shut on every load. So `restoreScript` runs in <head> before first
 * paint (wired up as a `headTags` entry in docusaurus.config.ts) and marks
 * <html> with `RESTORE_ATTRIBUTE`. The sidebar stylesheets draw the collapsed
 * width without a transition while it is set, and the `DocRoot/Layout/Sidebar`
 * swizzle removes it once React state has caught up.
 *
 * Imported by docusaurus.config.ts, so nothing here may touch browser APIs at
 * module scope.
 */

const STORAGE_KEY = 'eds-docs.sidebar-collapsed'

export const RESTORE_ATTRIBUTE = 'data-docs-sidebar-restore'

/** Whether the reader last left the sidebar collapsed. */
export function readSidebarCollapsed(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    // Storage can be blocked (privacy settings, some embedded browsers).
    return false
  }
}

export function storeSidebarCollapsed(collapsed: boolean): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(collapsed))
  } catch {
    // Without storage the sidebar still toggles; it is just not remembered.
  }
}

/** Inline <head> script: marks <html> before first paint if the sidebar was left collapsed. */
export const restoreScript = `try{if(localStorage.getItem('${STORAGE_KEY}')==='true')document.documentElement.setAttribute('${RESTORE_ATTRIBUTE}','')}catch(e){}`
