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
import { Tooltip, Button } from '../../'
import React from 'react'

const StyledTooltip = styled(Tooltip)`
  background: red;
`

const enterDelayDefault = 100

afterEach(cleanup)

describe('Tooltip', () => {
  it('Matches snapshot', async () => {
    render(
      <Tooltip title="Tooltip" id="snapshot-tooltip">
        <span>Test</span>
      </Tooltip>,
    )

    const content = screen.getByText('Test')

    fireEvent.mouseOver(content)

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip')
      expect(tooltip).toMatchSnapshot()
    })
  })
  it('can extend the css for the component', async () => {
    render(
      <StyledTooltip title="Tooltip">
        <span>Test</span>
      </StyledTooltip>,
    )

    const content = screen.getByText('Test')

    fireEvent.mouseOver(content)

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip')
      expect(tooltip).toHaveStyleRule('background', 'red')
    })
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
    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip')
      expect(tooltip).toHaveAttribute('data-popper-placement', 'right-start')
    })
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
    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip')
      expect(content).toBeDefined()
      expect(tooltip).toBeDefined()
    })
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
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeDefined()
    })
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
    expect(screen.queryByText('Tooltip')).not.toBeInTheDocument()

    await act(() => new Promise((r) => setTimeout(r, 300)))
    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip')
      expect(content).toBeDefined()
      expect(tooltip).toBeDefined()
    })
  })
  it('child onFocus is called when focusd', () => {
    const handler = jest.fn()
    render(
      <Tooltip title="Tooltip">
        <Button onFocus={handler}>Test</Button>
      </Tooltip>,
    )

    expect(handler).toBeCalled()
  })
})
