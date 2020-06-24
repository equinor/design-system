/* eslint-disable no-undef */
import React from 'react'
import { render, cleanup, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { save } from '@equinor/eds-icons'
import { Button, Icon } from '..'

Icon.add({ save })

const StyledButton = styled(Button)`
  position: relative;
  height: 100px;
  width: 100px;
`

afterEach(cleanup)

describe('Button', () => {
  it('Has provided icon when variant is icon', () => {
    const { queryByTestId, container } = render(
      <Button variant="ghost_icon">
        <Icon name="save" title="save me test" />
      </Button>,
    )
    expect(container.querySelector('svg')).toBeInTheDocument()
    expect(queryByTestId('eds-icon-path')).toHaveAttribute(
      'd',
      save.svgPathData,
    )
  })
  it('Can extend the css for the component', () => {
    const { container } = render(<StyledButton>Test me!</StyledButton>)
    expect(container.firstChild).toHaveStyleRule('position', 'relative')
    expect(container.firstChild).toHaveStyleRule('height', '100px')
    expect(container.firstChild).toHaveStyleRule('width', '100px')
  })
  it('onSubmit is called one time when used in form', () => {
    const handleSubmit = jest.fn()

    render(
      <form onSubmit={handleSubmit}>
        <Button type="submit">Submit button</Button>
      </form>,
    )

    const submitButton = screen.queryByText('Submit button')

    fireEvent.submit(submitButton)

    expect(handleSubmit).toHaveBeenCalledTimes(1)
  })
  it('onSubmit is ignored in form by default', () => {
    const handleSubmit = jest.fn()

    render(
      <form onSubmit={handleSubmit}>
        <Button>Submit button</Button>
      </form>,
    )

    const submitButton = screen.queryByText('Submit button')

    fireEvent.click(submitButton)

    expect(handleSubmit).toHaveBeenCalledTimes(0)
  })
  it('Has provided icon when leftIcon or rightIcon props are defined', () => {
    const { queryByTestId, container } = render(
      <Button rightIcon={<Icon name="save" title="save"></Icon>} />,
    )
    expect(container.querySelector('svg')).toBeInTheDocument()
    expect(queryByTestId('eds-icon-path')).toHaveAttribute(
      'd',
      save.svgPathData,
    )
  })
  it('renders an a as root node when href prop is defined', () => {
    const { container } = render(<Button href="/" />)
    expect(container.querySelector('a')).toBeInTheDocument()
  })
})
