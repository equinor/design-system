/* eslint-disable no-undef */
import * as React from 'react'
import { render, cleanup, screen, fireEvent } from '@utils'
import { waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { Popover } from '.'
import type { PopoverProps } from './Popover'

// We override Popover for testing and set props to partial because AnchorEl is applied to children in custom render function
const TestPopover = Popover as React.ForwardRefExoticComponent<
  Partial<PopoverProps>
>

const StyledPopover = styled(TestPopover)`
  background: red;
`

afterEach(cleanup)

describe('Popover', () => {
  it('can extend the css for the component', async () => {
    render(
      <StyledPopover open>
        <div>some random content</div>
      </StyledPopover>,
    )
    const container = screen.getByTestId('popover')

    await waitFor(() => expect(container).toHaveStyleRule('background', 'red'))
  })
  it('is visible when open is true & anchorEl is set', async () => {
    render(
      <TestPopover open placement="right-start">
        <div>some random content</div>
      </TestPopover>,
    )
    const container = screen.getByTestId('popover')
    await waitFor(() =>
      expect(container).toHaveStyleRule('visibility', 'visible'),
    )
    expect(container).toHaveAttribute('data-popper-placement', 'right-start')
  })

  it('has rendered Popover Title', async () => {
    render(
      <TestPopover open>
        <Popover.Title>Title Text</Popover.Title>
      </TestPopover>,
    )
    const title = screen.getByText('Title Text')
    await waitFor(() => expect(title).toBeDefined())
  })
  it('has rendered Popover Content', async () => {
    render(
      <TestPopover open>
        <Popover.Content>Content Text</Popover.Content>
      </TestPopover>,
    )
    const content = screen.getByText('Content Text')
    await waitFor(() => expect(content).toBeDefined())
  })

  it('has called onClose when close button is clicked', async () => {
    const handleOnClose = jest.fn()

    render(
      <TestPopover open onClose={handleOnClose}>
        <div>some random content</div>
      </TestPopover>,
    )
    const closeButton = screen.getByTestId('popover-close')

    fireEvent.click(closeButton)

    await waitFor(() => expect(handleOnClose).toHaveBeenCalled())
  })
  it("doesn't crash if no children is provided to Popover component", async () => {
    const placement = 'top'
    const { queryByText } = render(<TestPopover placement={placement} />)
    await waitFor(() => expect(queryByText(placement)).toBeDefined())
  })
  it("doesn't crash if Popover Content children is undefined", async () => {
    const placement = 'top'
    const { queryByText } = render(
      <TestPopover placement={placement}>
        <Popover.Title>Title</Popover.Title>
        <Popover.Content></Popover.Content>
      </TestPopover>,
    )
    await waitFor(() => expect(queryByText(placement)).toBeDefined())
  })
  it("doesn't crash if Popover Title children is undefined", async () => {
    const placement = 'top'
    const { queryByText } = render(
      <TestPopover placement={placement}>
        <Popover.Title></Popover.Title>
        <Popover.Content>Content</Popover.Content>
      </TestPopover>,
    )
    await waitFor(() => expect(queryByText(placement)).toBeDefined())
  })
})
