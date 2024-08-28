/* eslint-disable no-undef */
import { render, cleanup, screen, waitFor, act } from '../../test'
import { axe } from 'jest-axe'
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
const mockResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
}))

beforeAll(() => {
  window.ResizeObserver = mockResizeObserver
})

describe('Popover', () => {
  it('Matches snapshot', async () => {
    render(
      <StyledPopover open data-testid="popover">
        <div>some random content</div>
      </StyledPopover>,
    )
    const container = await screen.findByTestId('popover')

    expect(container).toMatchSnapshot()
  })
  it('Should pass a11y test', async () => {
    const { container } = render(
      <TestPopover open>
        <Popover.Title>Title Text</Popover.Title>
        <Popover.Content>Content Text</Popover.Content>
        <Popover.Actions>
          <button type="button">OK</button>
        </Popover.Actions>
      </TestPopover>,
    )
    await act(async () => {
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  it('can extend the css for the component', async () => {
    render(
      <StyledPopover open data-testid="popover">
        <div>some random content</div>
      </StyledPopover>,
    )
    const container = screen.getByTestId('popover')

    await waitFor(() => expect(container).toHaveStyleRule('background', 'red'))
  })
  it('is visible when open is true & anchorEl is set', () => {
    render(
      <TestPopover open placement="right-start" data-testid="popover">
        <div>some random content</div>
      </TestPopover>,
    )
    const container = screen.queryByTestId('popover')
    expect(container).toBeDefined()
    expect(container).toBeVisible()
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
  it("doesn't crash if no children is provided to Popover component", async () => {
    const placement = 'top'
    render(<TestPopover placement={placement} data-testid="popover" open />)
    expect(await screen.findByTestId('popover')).toBeDefined()
  })
  it("doesn't crash if Popover Content children is undefined", async () => {
    const placement = 'top'
    render(
      <TestPopover placement={placement} data-testid="popover" open>
        <Popover.Title>Title</Popover.Title>
        <Popover.Content></Popover.Content>
      </TestPopover>,
    )
    expect(await screen.findByTestId('popover')).toBeDefined()
  })
  it("doesn't crash if Popover Title children is undefined", async () => {
    const placement = 'top'
    render(
      <TestPopover placement={placement} data-testid="popover" open>
        <Popover.Title></Popover.Title>
        <Popover.Content>Content</Popover.Content>
      </TestPopover>,
    )
    expect(await screen.findByTestId('popover')).toBeDefined()
  })
})
