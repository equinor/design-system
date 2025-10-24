/* eslint-disable no-undef */
import { render, screen, fireEvent } from '@testing-library/react'
import styled from 'styled-components'
import { Icon } from '@equinor/eds-core-react'
import * as icons from '@equinor/eds-icons'
import { CSSButton } from './Button'
import React from 'react'

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
Icon.add(icons)

const StyledButton = styled(CSSButton)`
  position: relative;
  height: 100px;
  width: 100px;
`

const MarginButton = styled(CSSButton)`
  margin: 12px;
`

describe('Button', () => {
  it('Matches snapshot', () => {
    const { asFragment } = render(<CSSButton>Button</CSSButton>)
    expect(asFragment()).toMatchSnapshot()
  })
  it('Has provided icon when variant is icon', () => {
    render(
      <CSSButton variant="ghost_icon">
        <Icon name="save" title="save me test" />
      </CSSButton>,
    )
    expect(screen.getByLabelText('save me test')).toBeInTheDocument()
    expect(screen.queryByTestId('eds-icon-path')).toHaveAttribute(
      'd',
      icons.save.svgPathData,
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
        <CSSButton type="submit">Submit button</CSSButton>
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
      <CSSButton>
        <Icon name="save" title="save"></Icon>Button
      </CSSButton>,
    )
    expect(screen.getByLabelText('save')).toBeInTheDocument()
    expect(screen.queryByTestId('eds-icon-path')).toHaveAttribute(
      'd',
      icons.save.svgPathData,
    )
  })
  it('Renders as a link when href prop is defined', () => {
    render(<CSSButton href="/" />)
    const button = screen.getByRole('link')

    expect(button).toBeInTheDocument()
  })
  it('Can change margins', () => {
    render(<MarginButton>Test me!</MarginButton>)
    const button = screen.getByRole('button')
    expect(button).toHaveStyleRule('margin', '12px')
  })
})
