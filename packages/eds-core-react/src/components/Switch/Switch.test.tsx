/* eslint-disable no-undef */

import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import { axe } from 'jest-axe'
import userEvent from '@testing-library/user-event'
import { styled } from 'styled-components'

import { Switch } from './Switch'

const StyledSwitch = styled(Switch)`
  clip-path: unset;
`

describe('Switch', () => {
  it('Matches snapshot', () => {
    const { asFragment } = render(<Switch label="switch" />)
    expect(asFragment()).toMatchSnapshot()
  })
  it('Should pass a11y test', async () => {
    const { container } = render(<Switch label="switch" />)
    expect(await axe(container)).toHaveNoViolations()
  })
  it('Should pass a11y test with aria-label', async () => {
    const { container } = render(<Switch aria-label="switch" />)
    expect(await axe(container)).toHaveNoViolations()
  })
  it('Can extend the css for the component', () => {
    const { container } = render(<StyledSwitch label="switch-test" />)
    // eslint-disable-next-line testing-library/no-node-access
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
    render(<Switch label={labelText} />)
    const switchElement = screen.getByLabelText(labelText)
    expect(switchElement).not.toBeChecked()
    fireEvent.click(switchElement)
    expect(switchElement).toBeChecked()
    fireEvent.click(switchElement)
    expect(switchElement).not.toBeChecked()
  })
  it('Has a small version', () => {
    const labelText = 'Small switch'
    render(<Switch label={labelText} size="small" />)
    const smallSwitch = screen.getByLabelText(labelText)
    expect(smallSwitch).toBeDefined()
  })
  it('Can be disabled', async () => {
    render(
      <div>
        <Switch label="Checkbox one" disabled />
      </div>,
    )
    const one = screen.getByLabelText('Checkbox one')
    expect(one).not.toBeChecked()
    await userEvent.click(one)
    expect(one).not.toBeChecked()
  })
  it('Can be set as default on without being a controlled component', () => {
    const labelText = 'Default checked switch'
    render(<Switch label={labelText} defaultChecked />)
    const switchElement = screen.getByLabelText(labelText)
    expect(switchElement).toBeChecked()
  })
})
