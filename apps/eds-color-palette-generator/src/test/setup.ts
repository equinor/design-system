// jest-dom matchers (toBeInTheDocument, toHaveAttribute, …) for component
// tests. Harmless in the node environment the other tests use.
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
  if (typeof localStorage !== 'undefined') localStorage.clear()
})
