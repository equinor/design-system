/* eslint-disable no-undef */
import * as React from 'react'
import { render, cleanup, screen } from '@utils'
import { waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { Tooltip } from '.'
import type { TooltipProps } from './Tooltip'

// We override Tooltip for testing and set props to partial because AnchorEl is applied to children in custom render function
const TestTooltip = Tooltip as React.ForwardRefExoticComponent<
  Partial<TooltipProps>
>

const StyledTooltip = styled(TestTooltip)`
  background: red;
`

afterEach(cleanup)

describe('Tooltip', () => {
  it('can extend the css for the component', async () => {
    render(<StyledTooltip open title="Tooltip" />)
    const container = screen.getByRole('tooltip')

    await waitFor(() => expect(container).toHaveStyleRule('background', 'red'))
  })
  it('is visible when open is true & anchorEl is set', async () => {
    render(<TestTooltip open placement="right-start" />)
    const container = screen.getByRole('tooltip')
    await waitFor(() =>
      expect(container).toHaveStyleRule('visibility', 'visible'),
    )
    expect(container).toHaveAttribute('data-popper-placement', 'right-start')
  })
  it('renders with a title', async () => {
    render(<TestTooltip open placement="right-start" title="Tooltip Text" />)
    const title = screen.getByText('Tooltip Text')
    await waitFor(() => expect(title).toBeDefined())
  })
})
