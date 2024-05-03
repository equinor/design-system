/* eslint-disable import/no-extraneous-dependencies */
import '@testing-library/jest-dom'
import { toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

// Workaround for jest-axe error: https://github.com/nickcolley/jest-axe/issues/147
const { getComputedStyle } = window
window.getComputedStyle = (elt) => getComputedStyle(elt)

HTMLElement.prototype.showPopover = jest.fn()
HTMLElement.prototype.hidePopover = jest.fn()
