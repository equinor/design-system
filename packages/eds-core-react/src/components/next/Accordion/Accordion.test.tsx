import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { Accordion } from './Accordion'

describe('Accordion', () => {
  it('renders accordion with header and content', () => {
    render(
      <Accordion>
        <Accordion.Header>Test Header</Accordion.Header>
        <Accordion.Content>Test Content</Accordion.Content>
      </Accordion>,
    )
    expect(screen.getByText('Test Header')).toBeInTheDocument()
  })

  it('is collapsed by default', () => {
    render(
      <Accordion>
        <Accordion.Header>Header</Accordion.Header>
        <Accordion.Content>Content</Accordion.Content>
      </Accordion>,
    )
    const details = screen.getByRole('group')
    expect(details).not.toHaveAttribute('open')
  })

  it('expands on click', async () => {
    const user = userEvent.setup()
    render(
      <Accordion>
        <Accordion.Header>Header</Accordion.Header>
        <Accordion.Content>Content</Accordion.Content>
      </Accordion>,
    )
    const summary = screen.getByText('Header')
    await user.click(summary)
    const details = screen.getByRole('group')
    expect(details).toHaveAttribute('open')
  })

  it('collapses on second click', async () => {
    const user = userEvent.setup()
    render(
      <Accordion>
        <Accordion.Header>Header</Accordion.Header>
        <Accordion.Content>Content</Accordion.Content>
      </Accordion>,
    )
    const summary = screen.getByText('Header')
    await user.click(summary)
    await user.click(summary)
    const details = screen.getByRole('group')
    expect(details).not.toHaveAttribute('open')
  })

  it('supports defaultOpen prop', () => {
    render(
      <Accordion defaultOpen>
        <Accordion.Header>Header</Accordion.Header>
        <Accordion.Content>Content</Accordion.Content>
      </Accordion>,
    )
    const details = screen.getByRole('group')
    expect(details).toHaveAttribute('open')
  })

  it('supports controlled open state', async () => {
    const onToggle = jest.fn()
    const { rerender } = render(
      <Accordion open={false} onToggle={onToggle}>
        <Accordion.Header>Header</Accordion.Header>
        <Accordion.Content>Content</Accordion.Content>
      </Accordion>,
    )
    const user = userEvent.setup()
    const summary = screen.getByText('Header')
    await user.click(summary)
    expect(onToggle).toHaveBeenCalledWith(true)

    // Controlled state should be respected
    rerender(
      <Accordion open={true} onToggle={onToggle}>
        <Accordion.Header>Header</Accordion.Header>
        <Accordion.Content>Content</Accordion.Content>
      </Accordion>,
    )
    const details = screen.getByRole('group')
    expect(details).toHaveAttribute('open')
  })

  it('renders multiple accordions', () => {
    render(
      <>
        <Accordion>
          <Accordion.Header>First Header</Accordion.Header>
          <Accordion.Content>First Content</Accordion.Content>
        </Accordion>
        <Accordion>
          <Accordion.Header>Second Header</Accordion.Header>
          <Accordion.Content>Second Content</Accordion.Content>
        </Accordion>
      </>,
    )
    expect(screen.getByText('First Header')).toBeInTheDocument()
    expect(screen.getByText('Second Header')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(
      <Accordion className="custom-class">
        <Accordion.Header>Header</Accordion.Header>
        <Accordion.Content>Content</Accordion.Content>
      </Accordion>,
    )
    const details = screen.getByRole('group')
    expect(details).toHaveClass('accordion', 'custom-class')
  })
})
