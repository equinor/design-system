import '@testing-library/jest-dom'
import 'jest-styled-components'
import { toHaveNoViolations } from 'jest-axe'
import React from 'react'

// Mock React.useId to return consistent IDs for snapshot tests
// This ensures the same IDs are generated in both local and CI environments
jest.spyOn(React, 'useId').mockReturnValue('test-id')

expect.extend(toHaveNoViolations)

// Workaround for jest-axe error: https://github.com/nickcolley/jest-axe/issues/147
// eslint-disable-next-line @typescript-eslint/unbound-method
const { getComputedStyle } = window
window.getComputedStyle = (elt) => getComputedStyle(elt)

HTMLElement.prototype.showPopover = jest.fn()
HTMLElement.prototype.hidePopover = jest.fn()
