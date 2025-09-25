/* eslint-disable no-undef */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { axe } from 'jest-axe'
import { Breadcrumbs } from '.'

const { Breadcrumb } = Breadcrumbs

// --- Mocks for målinger som ellipsis/Overflow + Floating UI ---
const roMock = class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver

beforeAll(() => {
  // ResizeObserver for Floating UI
  if (!window.ResizeObserver) window.ResizeObserver = roMock

  // Sørg for at elementer ser "smale" ut, så scrollWidth > clientWidth
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    get() {
      return 100
    },
  })
  Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
    configurable: true,
    get() {
      return 200 // > clientWidth => overflow
    },
  })
  // Noen lib’er bruker BCR-bredde
  const rect = {
    x: 0,
    y: 0,
    width: 100,
    height: 20,
    top: 0,
    left: 0,
    bottom: 20,
    right: 100,
    toJSON: () => {},
  }
  jest
    .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
    .mockImplementation(() => rect as DOMRect)
})

afterAll(() => {
  jest.restoreAllMocks()
})

describe('Breadcrumbs', () => {
  it('Matches snapshot', () => {
    const { asFragment } = render(
      <Breadcrumbs>
        <Breadcrumb>Label 1</Breadcrumb>
        <Breadcrumb>Label 2</Breadcrumb>
        <Breadcrumb>Label 3</Breadcrumb>
      </Breadcrumbs>,
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('Should pass a11y test', async () => {
    const { container } = render(
      <Breadcrumbs>
        <Breadcrumb href="#">Label 1</Breadcrumb>
        <Breadcrumb href="#">Label 2</Breadcrumb>
        <Breadcrumb href="#">Label 3</Breadcrumb>
      </Breadcrumbs>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has aria label', () => {
    render(
      <Breadcrumbs>
        <Breadcrumb>Label 1</Breadcrumb>
        <Breadcrumb>Label 2</Breadcrumb>
        <Breadcrumb>Label 3</Breadcrumb>
      </Breadcrumbs>,
    )
    const breadcrumbs = screen.getByLabelText('breadcrumbs')
    expect(breadcrumbs).toHaveAttribute('aria-label', 'breadcrumbs')
  })

  it('should render three normal breadcrumbs', () => {
    render(
      <Breadcrumbs>
        <Breadcrumb>Label 1</Breadcrumb>
        <Breadcrumb>Label 2</Breadcrumb>
        <Breadcrumb>Label 3</Breadcrumb>
      </Breadcrumbs>,
    )
    expect(screen.getAllByRole('listitem', { hidden: false })).toHaveLength(3)
    expect(screen.getByRole('list')).toHaveTextContent(
      'Label 1/Label 2/Label 3',
    )
  })

  it('should render ellipsis between first and last crumb when collapsed', () => {
    render(
      <Breadcrumbs collapse>
        <Breadcrumb>Label 1</Breadcrumb>
        <Breadcrumb>Label 2</Breadcrumb>
        <Breadcrumb>Label 3</Breadcrumb>
        <Breadcrumb>Label 4</Breadcrumb>
        <Breadcrumb>Label 5</Breadcrumb>
        <Breadcrumb>Label 6</Breadcrumb>
      </Breadcrumbs>,
    )
    expect(screen.getAllByRole('listitem', { hidden: false })).toHaveLength(3)
    expect(screen.getByRole('list')).toHaveTextContent('Label 1/…/Label 6')
  })

  it('should expand from collapsed state when clicking the ellipsis', async () => {
    const user = userEvent.setup()
    render(
      <Breadcrumbs collapse>
        <Breadcrumb>Label 1</Breadcrumb>
        <Breadcrumb>Label 2</Breadcrumb>
        <Breadcrumb>Label 3</Breadcrumb>
        <Breadcrumb>Label 4</Breadcrumb>
        <Breadcrumb>Label 5</Breadcrumb>
        <Breadcrumb>Label 6</Breadcrumb>
      </Breadcrumbs>,
    )
    const ellipsisButton = screen.getByRole('button')
    expect(screen.getByRole('list')).toHaveTextContent('Label 1/…/Label 6')
    await user.click(ellipsisButton)
    expect(screen.getByRole('list')).toHaveTextContent(
      'Label 1/Label 2/Label 3/Label 4/Label 5/Label 6',
    )
  })

  it('should crop the labels and have tooltip on hover when maxWidth is defined', async () => {
    // Hvis Tooltip har delay, bruk fake timers
    jest.useFakeTimers()
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })

    render(
      <Breadcrumbs>
        <Breadcrumb maxWidth={30}>Label 1</Breadcrumb>
        <Breadcrumb maxWidth={30}>Label 2</Breadcrumb>
        <Breadcrumb maxWidth={30}>Label 3</Breadcrumb>
      </Breadcrumbs>,
    )

    const [first] = screen.getAllByText(/^Label\s\d$/)
    expect(first).toHaveStyle({ 'max-width': '30px' })

    await user.hover(first)
    // match Tooltip delay (juster hvis deres default er annen)
    jest.advanceTimersByTime(600)

    const tooltip = await screen.findByRole('tooltip')
    expect(tooltip).toBeInTheDocument()

    jest.useRealTimers()
  })

  it('can extend the css for the component', () => {
    render(
      <Breadcrumbs style={{ position: 'absolute' }}>
        <Breadcrumb>Label</Breadcrumb>
      </Breadcrumbs>,
    )
    expect(screen.getByLabelText('breadcrumbs')).toHaveStyle({
      position: 'absolute',
    })
  })
})
