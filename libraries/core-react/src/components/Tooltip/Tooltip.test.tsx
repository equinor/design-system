/* eslint-disable no-undef */
import * as React from 'react'
import {
  fireEvent,
  waitFor,
  render,
  cleanup,
  screen,
} from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { Tooltip } from '.'

const StyledTooltip = styled(Tooltip)`
  background: red;
`

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

    const tooltip = screen.getByRole('tooltip')

    await waitFor(() =>
      expect(tooltip).toHaveStyleRule('visibility', 'visible'),
    )
    expect(tooltip).toHaveAttribute('data-popper-placement', 'right-start')
  })
  it('renders with a title', async () => {
    render(
      <Tooltip title="Tooltip" placement="right-start">
        <span>Test</span>
      </Tooltip>,
    )

    const content = screen.getByText('Test')

    fireEvent.mouseOver(content)

    const tooltip = screen.getByRole('tooltip')

    await waitFor(() => {
      expect(content).toBeDefined()
      expect(tooltip).toBeDefined()
    })
  })
})
