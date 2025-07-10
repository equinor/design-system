import { isFirefox, getMeasureElementHandler } from './utils'

describe('getMeasureElementHandler', () => {
  const originalUserAgent = navigator.userAgent

  function mockUserAgent(userAgent: string) {
    Object.defineProperty(window.navigator, 'userAgent', {
      value: userAgent,
      configurable: true,
    })
  }

  afterEach(() => {
    mockUserAgent(originalUserAgent)
  })

  it('returns true if the browser is Firefox and handler is undefined', () => {
    mockUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
    )
    expect(isFirefox()).toBe(true)
    const handler = getMeasureElementHandler()
    expect(handler).toBeUndefined()
  })

  it('returns false if the browser is not Firefox (e.g., Chrome) and a callback handler', () => {
    mockUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/114.0.0.0 Safari/537.36',
    )
    expect(isFirefox()).toBe(false)
    const handler = getMeasureElementHandler()
    expect(typeof handler).toBe('function')
  })

  it('callback handler calculates the height of a visible element', () => {
    const handler = getMeasureElementHandler()
    const el = document.createElement('tr')
    el.getBoundingClientRect = () => ({ height: 88 }) as DOMRect
    expect(handler?.(el)).toBe(88)
  })
})
