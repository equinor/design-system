// Shared set-up for every test file. The jest-dom matchers
// (toBeInTheDocument, toHaveAttribute, …) are harmless in the node
// environment; the rest only runs in jsdom, which component tests opt into
// with `// @vitest-environment jsdom`.
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'

const isDom = typeof window !== 'undefined'

beforeEach(() => {
  if (!isDom) return

  // jsdom has <dialog> and its `open` attribute, but not showModal() or
  // close(). These do what the browser does with the attribute, and close()
  // fires `close` as the browser does, also for Escape. Fresh spies per test,
  // so a test can assert on HTMLDialogElement.prototype.showModal.
  HTMLDialogElement.prototype.showModal = vi.fn(function (
    this: HTMLDialogElement,
  ) {
    this.setAttribute('open', '')
  })
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    if (!this.hasAttribute('open')) return
    this.removeAttribute('open')
    this.dispatchEvent(new Event('close'))
  })

  // jsdom has no matchMedia, and ColorSchemeProvider listens to
  // prefers-color-scheme. A test can stub its own over this one.
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(() => false),
    })),
  )
})

afterEach(() => {
  // First, so a test that stubbed `document` or `window` away cannot break
  // the clean-up below
  vi.unstubAllGlobals()
  cleanup()
  if (!isDom) return
  localStorage.clear()
  // The scheme the pre-paint script would set; tests set it directly
  document.documentElement.removeAttribute('data-color-scheme')
})
