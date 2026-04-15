import '@testing-library/jest-dom'
import 'jest-styled-components'

HTMLElement.prototype.showPopover = jest.fn()
HTMLElement.prototype.hidePopover = jest.fn()
