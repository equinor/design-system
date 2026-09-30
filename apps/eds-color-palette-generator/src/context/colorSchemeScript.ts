import { STORAGE_KEYS } from '@/utils/localStorage'

/**
 * Runs in <head> before first paint and sets `data-color-scheme` on <html>,
 * so a saved dark choice does not flash light while React hydrates. The rule
 * is: `?mode=` in the URL (shared Theme Builder links), then the saved choice,
 * then the system preference. ColorSchemeProvider reads the result.
 */
export const COLOR_SCHEME_SCRIPT = `(function () {
  try {
    var ok = function (v) { return v === 'light' || v === 'dark' }
    var mode = new URLSearchParams(location.search).get('mode')
    if (!ok(mode)) {
      var saved = localStorage.getItem(${JSON.stringify(STORAGE_KEYS.COLOR_SCHEME)})
      mode = saved ? JSON.parse(saved) : null
    }
    if (!ok(mode)) {
      mode = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    document.documentElement.setAttribute('data-color-scheme', mode)
  } catch (e) {}
})()`
