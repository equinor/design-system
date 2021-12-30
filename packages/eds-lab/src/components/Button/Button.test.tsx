/* eslint-disable no-undef */
import { render, cleanup, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { Icon } from '@equinor/eds-core-react'
import { save } from '@equinor/eds-icons'
import { Button } from './Button'
import React from 'react'

Icon.add({ save })

const StyledButton = styled(Button)`
  position: relative;
  height: 100px;
  width: 100px;
`

const MarginButton = styled(Button)`
  margin: 12px;
`

afterEach(cleanup)

describe('Button', () => {
  it('Matches snapshot', () => {
    const { asFragment } = render(<Button>Button</Button>)
    expect(asFragment()).toMatchSnapshot()
  })
  it('Has provided icon when variant is icon', () => {
    render(
      <Button variant="ghost_icon">
        <Icon name="save" title="save me test" />
      </Button>,
    )
    expect(screen.getByLabelText('save me test')).toBeInTheDocument()
    expect(screen.queryByTestId('eds-icon-path')).toHaveAttribute(
      'd',
      save.svgPathData,
    )
  })
  it('Can extend the css for the component', () => {
    render(<StyledButton>Test me!</StyledButton>)
    const button = screen.getByRole('button')

    expect(button).toHaveStyleRule('position', 'relative')
    expect(button).toHaveStyleRule('height', '100px')
    expect(button).toHaveStyleRule('width', '100px')
  })
  it('onSubmit is called one time when used in form', () => {
    const onSubmit = jest.fn((e: React.FormEvent<HTMLFormElement>) =>
      e.preventDefault(),
    )

    render(
      <form onSubmit={onSubmit}>
        <Button type="submit">Submit button</Button>
      </form>,
    )

    const submitButton = screen.queryByText('Submit button')

    fireEvent.submit(submitButton)

    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  // TODO Why do we want this behaviour?
  // it('onSubmit is ignored in form by default', () => {
  //   const onSubmit = jest.fn((e: React.FormEvent<HTMLFormElement>) =>
  //     e.preventDefault(),
  //   )

  //   render(
  //     <form onSubmit={onSubmit}>
  //       <Button>Submit button</Button>
  //     </form>,
  //   )

  //   const submitButton = screen.queryByText('Submit button')

  //   fireEvent.click(submitButton)

  //   expect(onSubmit).toHaveBeenCalledTimes(0)
  // })
  it('Has provided icon when icon and text is defined', () => {
    render(
      <Button>
        <Icon name="save" title="save"></Icon>Button
      </Button>,
    )
    expect(screen.getByLabelText('save')).toBeInTheDocument()
    expect(screen.queryByTestId('eds-icon-path')).toHaveAttribute(
      'd',
      save.svgPathData,
    )
  })
  it('Renders as a link when href prop is defined', () => {
    render(<Button href="/" />)
    const button = screen.getByRole('link')

    expect(button).toBeInTheDocument()
  })
  it('Can change margins', () => {
    render(<MarginButton>Test me!</MarginButton>)
    const button = screen.getByRole('button')
    expect(button).toHaveStyleRule('margin', '12px')
  })

  it('This is a new test to check if cache picks up new tests ', () => {
    expect(true).toBeTruthy()
  })
  it('y u no getting tested :(', () => {
    expect(true).toBeTruthy()
  })
})
