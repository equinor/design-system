/* eslint-disable no-undef */
import {
  fireEvent,
  waitFor,
  render,
  cleanup,
  screen,
  act,
} from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { Tooltip } from '.'

const StyledTooltip = styled(Tooltip)`
  background: red;
`

const enterDelayDefault = 100

afterEach(cleanup)

describe('Tooltip', () => {
  it('can extend the css for the component', async () => {
    render(
      <StyledTooltip title="Tooltip">
        <span>Test</span>
      </StyledTooltip>,
    )

    const content = screen.getByText('Test')

    fireEvent.mouseOver(content)
    const tooltip = screen.getByRole('tooltip')

    await waitFor(() => expect(tooltip).toHaveStyleRule('background', 'red'))
  })
  it('is visible when content is being hovered', async () => {
    render(
      <Tooltip title="Tooltip" placement="right-start">
        <div>Test</div>
      </Tooltip>,
    )

    const content = screen.getByText('Test')
    fireEvent.mouseOver(content)
    await act(() => new Promise((r) => setTimeout(r, enterDelayDefault)))

    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toHaveStyleRule('visibility', 'visible')
    expect(tooltip).toHaveAttribute('data-popper-placement', 'right-start')
  })
  it('renders with a correct title', async () => {
    render(
      <Tooltip title="Tooltip" placement="right-start">
        <span>Test</span>
      </Tooltip>,
    )

    const content = screen.getByText('Test')

    fireEvent.mouseOver(content)
    await act(() => new Promise((r) => setTimeout(r, enterDelayDefault)))

    const tooltip = screen.getByRole('tooltip')
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
    await act(() => new Promise((r) => setTimeout(r, enterDelayDefault)))

    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toHaveStyleRule('visibility', 'visible')
  })
  it('shows after correct delay', async () => {
    render(
      <Tooltip title="Tooltip" placement="right-start" enterDelay={500}>
        <span>Test</span>
      </Tooltip>,
    )

    const content = screen.getByText('Test')

    fireEvent.mouseOver(content)

    await act(() => new Promise((r) => setTimeout(r, 200)))

    const hiddenTooltip = screen.getByRole('tooltip', { hidden: true })
    expect(hiddenTooltip).toBeDefined()
    expect(hiddenTooltip).toHaveStyleRule('visibility', 'hidden')

    await act(() => new Promise((r) => setTimeout(r, 300)))

    const tooltip = screen.getByRole('tooltip')
    expect(content).toBeDefined()
    expect(tooltip).toBeDefined()
  })
})
