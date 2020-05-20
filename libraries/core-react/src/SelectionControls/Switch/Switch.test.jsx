/* eslint-disable no-undef */

import React from 'react'
import PropTypes from 'prop-types'
import { render, cleanup, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'

import { Switch } from './Switch'

afterEach(cleanup)

const StyledSwitch = styled(Switch)`
  clip-path: unset;
`

describe('Switch', () => {
  it('Can extend the css for the component', () => {
    const { container } = render(<StyledSwitch label="switch-test" />)
    expect(container.firstChild).toHaveStyleRule('clip-path', 'unset')
  })
  it('Has provided label', () => {
    const label = 'Switch label'
    render(<Switch label={label} />)
    const inputNode = screen.getByLabelText(label)
    expect(inputNode).toBeDefined()
  })
  it('Can be turned on and off', () => {
    const labelText = 'Switch label'
    const { getByLabelText } = render(<Switch label={labelText} />)
    const switchElement = getByLabelText(labelText)
    expect(switchElement).not.toBeChecked()
    fireEvent.click(switchElement)
    expect(switchElement).toBeChecked()
    fireEvent.click(switchElement)
    expect(switchElement).not.toBeChecked()
  })
})
