/* eslint-disable no-undef */
import * as React from 'react'
import { render, cleanup, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { save } from '@equinor/eds-icons'
import { Button } from './Button'
import { Icon } from '../Icon'

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
  it('Has provided icon when icon and text is defined', () => {
    const { queryByTestId, container } = render(
      <Button>
        <Icon name="save" title="save"></Icon>Button
      </Button>,
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
  it('Can change margins', () => {
    const { container } = render(<MarginButton>Test me!</MarginButton>)
    expect(container.firstChild).toHaveStyleRule('margin', '12px')
  })

  it('has put non-react content inside center container', () => {
    render(
      <>
        <Button>123</Button>
        <Button>text</Button>
        <Button>
          <div>other-content</div>
        </Button>
      </>,
    )
    const numericalContent = screen.queryByText('123')
    const textContent = screen.queryByText('text')
    const otherContent = screen.queryByText('other-content')

    expect(numericalContent).toHaveStyleRule('flex', '1')
    expect(numericalContent.nodeName).toBe('SPAN')

    expect(textContent).toHaveStyleRule('flex', '1')
    expect(textContent.nodeName).toBe('SPAN')

    expect(otherContent).not.toHaveStyleRule('flex', '1')
    expect(otherContent.nodeName).toBe('DIV')
  })
})
