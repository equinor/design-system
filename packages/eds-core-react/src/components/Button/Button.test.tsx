/* eslint-disable no-undef */
import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'
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
const LinkButton = ({ to }: { to: string }) => {
  return (
    <a href={to} target="_blank" rel="noreferrer">
      click
    </a>
  )
}

describe('Button', () => {
  it('Matches snapshot', () => {
    const { asFragment } = render(<Button>Button</Button>)
    expect(asFragment()).toMatchSnapshot()
  })
  it('Should pass a11y test when has text only', async () => {
    const { container } = render(<Button>Button</Button>)
    expect(await axe(container)).toHaveNoViolations()
  })
  it('Should pass a11y test when variant is ghost_icon', async () => {
    const { container } = render(
      <Button variant="ghost_icon">
        <Icon name="save" title="save me test" />
      </Button>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
  it('Should pass a11y test when icon and text is defined', async () => {
    const { container } = render(
      <Button>
        <Icon name="save" title="save"></Icon>Button
      </Button>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
  it('Should pass a11y test when used in form', async () => {
    const { container } = render(
      <form>
        <Button type="submit">Submit button</Button>
      </form>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
  it('Should pass a11y test when label', async () => {
    const { container } = render(
      <label htmlFor="file-upload">
        <Button as="span">Upload</Button>
      </label>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
  it('Should pass a11y test when link', async () => {
    const { container } = render(<Button href="/">Link</Button>)
    expect(await axe(container)).toHaveNoViolations()
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
  it('Renders with a progress when loading prop is true', () => {
    render(<Button loading={true} />)
    const button = screen.getByRole('button')
    const progress = screen.getByRole('progressbar')

    expect(button).toBeInTheDocument()
    expect(progress).toBeInTheDocument()
  })
  it('Can be cast as another component', () => {
    render(<Button as={LinkButton} to="/" />)
    const button = screen.getByRole('link')

    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('target', '_blank')
  })
  it('Can change margins', () => {
    render(<MarginButton>Test me!</MarginButton>)
    const button = screen.getByRole('button')
    expect(button).toHaveStyleRule('margin', '12px')
  })
})
