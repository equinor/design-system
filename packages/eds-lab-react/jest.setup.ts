/* eslint-disable import/no-extraneous-dependencies */
import '@testing-library/jest-dom'
import 'jest-styled-components'

HTMLDivElement.prototype.showPopover = jest.fn()
HTMLDivElement.prototype.hidePopover = jest.fn()
