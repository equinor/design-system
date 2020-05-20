/* eslint-disable no-undef */

import React from 'react'
import PropTypes from 'prop-types'
import { render, cleanup, fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import 'jest-styled-components'
import styled from 'styled-components'

import { Radio } from './Radio'

afterEach(cleanup)

const StyledRadio = styled(Radio)`
  clip-path: unset;
`

describe('Radio', () => {
  it('Can extend the css for the component', () => {
    const { container } = render(<StyledRadio label="radio-test" />)
    expect(container.firstChild).toHaveStyleRule('clip-path', 'unset')
  })
  it('Has provided label', () => {
    const label = 'Radio label'
    render(<Radio label={label} />)
    const inputNode = screen.getByLabelText(label)
    expect(inputNode).toBeDefined()
  })
  it('Can be selected', () => {
    const labelText = 'Radio label'
    const { getByLabelText } = render(<Radio label={labelText} />)
    const radio = getByLabelText(labelText)
    expect(radio).not.toBeChecked()
    fireEvent.click(radio)
    expect(radio).toBeChecked()
  })
  it('Can be a controlled component', () => {
    const handleChange = jest.fn()
    const labelText = 'Radio label'
    const { getByLabelText } = render(
      <Radio
        label={labelText}
        name="test"
        value="testOne"
        onChange={handleChange}
      />,
    )
    const radio = getByLabelText(labelText)
    expect(radio).not.toBeChecked()
    expect(handleChange).toHaveBeenCalledTimes(0)
    fireEvent.click(radio)

    expect(radio).toBeChecked()
    expect(handleChange).toHaveBeenCalledTimes(1)
  })
  it('Can be used in a group', () => {
    const { getByLabelText } = render(
      <div>
        <Radio label="Radio one" name="test" value="one" />
        <Radio label="Radio two" name="test" value="two" />
      </div>,
    )
    const one = getByLabelText('Radio one')
    const two = getByLabelText('Radio two')
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
    const { getByLabelText } = render(<Radio label="Radio" disabled />)
    const one = getByLabelText('Radio')
    expect(one).not.toBeChecked()
    // Can't use fireEvent
    // See https://github.com/testing-library/react-testing-library/issues/275
    userEvent.click(one)
    expect(one).not.toBeChecked()
  })
})
