/* eslint-disable no-undef */

import React from 'react'
import { render, cleanup, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import userEvent from '@testing-library/user-event'
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
  it('Has a small version', () => {
    const labelText = 'Small switch'
    const { getByLabelText } = render(<Switch label={labelText} size="small" />)
    const smallSwitch = getByLabelText(labelText)
    expect(smallSwitch).toBeDefined()
  })
  it('Can be disabled', () => {
    const { getByLabelText } = render(
      <div>
        <Switch label="Checkbox one" disabled />
      </div>,
    )
    const one = getByLabelText('Checkbox one')
    expect(one).not.toBeChecked()
    userEvent.click(one)
    expect(one).not.toBeChecked()
  })
  it('Can be set as default on without being a controlled component', () => {
    const labelText = 'Default checked switch'
    const { getByLabelText } = render(
      <Switch label={labelText} defaultChecked />,
    )
    const switchElement = getByLabelText(labelText)
    expect(switchElement).toBeChecked()
  })
})
