/* eslint-disable no-undef */
import { render, cleanup, fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { axe } from 'jest-axe'
import 'jest-styled-components'
import styled from 'styled-components'

import { Radio } from './Radio'

afterEach(cleanup)

const StyledRadio = styled(Radio)`
  clip-path: unset;
`

describe('Radio', () => {
  it('Matches snapshot', () => {
    const { asFragment } = render(<Radio label="label" />)
    expect(asFragment()).toMatchSnapshot()
  })
  it('Should pass a11y test', async () => {
    const { container } = render(<Radio label="label" />)
    expect(await axe(container)).toHaveNoViolations()
  })
  it('Can extend the css for the component', () => {
    render(<StyledRadio label="radio-test" />)
    expect(
      // eslint-disable-next-line testing-library/no-node-access
      screen.getByLabelText('radio-test').parentElement.parentElement,
    ).toHaveStyleRule('clip-path', 'unset')
  })
  it('Has provided label', () => {
    const label = 'Radio label'
    render(<Radio label={label} />)
    const inputNode = screen.getByLabelText(label)
    expect(inputNode).toBeDefined()
  })
  it('Can be selected', () => {
    const labelText = 'Radio label'
    render(<Radio label={labelText} />)
    const radio = screen.getByLabelText(labelText)
    expect(radio).not.toBeChecked()
    fireEvent.click(radio)
    expect(radio).toBeChecked()
  })
  it('Can be a controlled component', () => {
    const handleChange = jest.fn()
    const labelText = 'Radio label'
    render(
      <Radio
        label={labelText}
        name="test"
        value="testOne"
        onChange={handleChange}
      />,
    )
    const radio = screen.getByLabelText(labelText)
    expect(radio).not.toBeChecked()
    expect(handleChange).toHaveBeenCalledTimes(0)
    fireEvent.click(radio)

    expect(radio).toBeChecked()
    expect(handleChange).toHaveBeenCalledTimes(1)
  })
  it('Can be used in a group', () => {
    render(
      <div>
        <Radio label="Radio one" name="test" value="one" />
        <Radio label="Radio two" name="test" value="two" />
      </div>,
    )
    const one = screen.getByLabelText('Radio one')
    const two = screen.getByLabelText('Radio two')
    expect(one).not.toBeChecked()
    expect(two).not.toBeChecked()
    fireEvent.click(one)
    expect(one).toBeChecked()
    expect(two).not.toBeChecked()
    fireEvent.click(two)
    expect(one).not.toBeChecked()
    expect(two).toBeChecked()
  })
  it('Can be disabled', () => {
    render(<Radio label="Radio" disabled />)
    const one = screen.getByLabelText('Radio')
    expect(one).not.toBeChecked()
    // Can't use fireEvent
    // See https://github.com/testing-library/react-testing-library/issues/275
    userEvent.click(one)
    expect(one).not.toBeChecked()
  })
})
