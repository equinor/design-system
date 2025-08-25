/* eslint-disable no-undef */
import { fireEvent, render, screen, act } from '@testing-library/react'
import { axe } from 'jest-axe'
import styled from 'styled-components'
import { Tooltip, Button } from '../../'

const StyledTooltip = styled(Tooltip)`
  background: red;
`
const openDelay = 100

const mockResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
}))

beforeAll(() => {
  window.ResizeObserver = mockResizeObserver
})

describe('Tooltip', () => {
  it('Matches snapshot', async () => {
    render(
      <Tooltip title="Tooltip" enterDelay={0}>
        <span>Test</span>
      </Tooltip>,
    )

    const content = screen.getByText('Test')
    fireEvent.mouseEnter(content)
    const tooltip = await screen.findByRole('tooltip')
    expect(tooltip).toMatchSnapshot()
  })
  it('Should pass a11y test', async () => {
    const { container } = render(
      <Tooltip title="Tooltip">
        <span>Test</span>
      </Tooltip>,
    )

    const content = screen.getByText('Test')

    fireEvent.mouseEnter(content)
    await act(() => new Promise((r) => setTimeout(r, openDelay)))

    const results = await axe(container)

    expect(results).toHaveNoViolations()
  })
  it('Should pass a11y test with id & placement', async () => {
    const { container } = render(
      <Tooltip title="Tooltip" id="a11y-tooltip" placement="top" enterDelay={0}>
        <span>Test</span>
      </Tooltip>,
    )

    const content = screen.getByText('Test')

    fireEvent.mouseEnter(content)

    await act(async () => {
      expect(await axe(container)).toHaveNoViolations()
    })
  })
  it('can extend the css for the component', async () => {
    render(
      <StyledTooltip title="Tooltip">
        <span>Test</span>
      </StyledTooltip>,
    )

    const content = screen.getByText('Test')

    fireEvent.mouseEnter(content)
    await act(() => new Promise((r) => setTimeout(r, openDelay)))

    const tooltip = await screen.findByRole('tooltip')
    expect(tooltip).toHaveStyleRule('background', 'red')
  })
  it('is visible when content is being hovered', async () => {
    render(
      <Tooltip title="Tooltip" placement="right-start">
        <div>Test</div>
      </Tooltip>,
    )

    const content = screen.getByText('Test')

    fireEvent.mouseEnter(content)
    await act(() => new Promise((r) => setTimeout(r, openDelay)))

    const tooltip = await screen.findByRole('tooltip')
    expect(tooltip).toBeInTheDocument()
  })
  it('is not rendered when disabled', async () => {
    render(
      <Tooltip title="Tooltip" placement="right-start" disabled>
        <div>Test</div>
      </Tooltip>,
    )

    const content = screen.getByText('Test')

    fireEvent.mouseEnter(content)
    await act(() => new Promise((r) => setTimeout(r, openDelay)))

    const tooltip = screen.queryByRole('tooltip')
    expect(tooltip).not.toBeInTheDocument()
  })
  it('renders with a correct title', async () => {
    render(
      <Tooltip title="Tooltip" placement="right-start">
        <span>Test</span>
      </Tooltip>,
    )

    const content = screen.getByText('Test')

    fireEvent.mouseEnter(content)
    await act(() => new Promise((r) => setTimeout(r, openDelay)))

    const tooltip = await screen.findByRole('tooltip')

    expect(content).toBeDefined()
    expect(tooltip).toBeDefined()
  })
  it('renders on focus', async () => {
    render(
      <Tooltip title="Tooltip" placement="right-start">
        <span>Test</span>
      </Tooltip>,
    )

    const content = screen.getByText('Test')

    fireEvent.focusIn(content)
    await act(() => new Promise((r) => setTimeout(r, openDelay)))

    expect(await screen.findByRole('tooltip')).toBeDefined()
  })
  it('shows after correct delay', async () => {
    render(
      <Tooltip title="Tooltip" placement="right-start" enterDelay={500}>
        <span>Test</span>
      </Tooltip>,
    )

    const content = screen.getByText('Test')

    fireEvent.mouseEnter(content)
    await act(() => new Promise((r) => setTimeout(r, 200)))
    expect(screen.queryByText('Tooltip')).not.toBeInTheDocument()

    await act(() => new Promise((r) => setTimeout(r, 300)))

    const tooltip = await screen.findByRole('tooltip')

    expect(content).toBeDefined()
    expect(tooltip).toBeDefined()
  })
  it('child onFocus is called when focused', async () => {
    const handler = jest.fn()
    render(
      <Tooltip title="Tooltip">
        <Button onFocus={handler}>Test</Button>
      </Tooltip>,
    )

    const button = screen.getByText('Test')

    fireEvent.focus(button)
    await act(() => new Promise((r) => setTimeout(r, openDelay)))

    expect(handler).toBeCalled()
  })
})
