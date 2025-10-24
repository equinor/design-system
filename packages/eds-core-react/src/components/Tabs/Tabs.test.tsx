/* eslint-disable no-undef */
import { useRef, useEffect, useState, Fragment } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { axe } from 'jest-axe'
import { Tabs } from '.'

const noop = () => null

const TabsWithRefs = () => {
  const activeRef = useRef<HTMLButtonElement>(null)
  const inactiveRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (activeRef?.current) {
      activeRef.current.textContent = 'Active tab'
    }
    if (inactiveRef?.current) {
      inactiveRef.current.textContent = 'Inactive tab'
    }
  }, [])

  return (
    <Tabs activeTab={0} onChange={noop}>
      <Tabs.List>
        <Tabs.Tab ref={activeRef}>Tab one</Tabs.Tab>
        <Tabs.Tab ref={inactiveRef}>Tab two</Tabs.Tab>
        <Tabs.Tab>Tab three</Tabs.Tab>
      </Tabs.List>
    </Tabs>
  )
}

const TabsWithPanels = ({
  selectedTabIndex = 0,
}: {
  // eslint-disable-next-line react/require-default-props
  selectedTabIndex?: number | string
}) => {
  const [activeTab, setActiveTab] = useState(selectedTabIndex)

  const handleChange = (index: number | string) => {
    setActiveTab(index)
  }

  return (
    <Fragment>
      <Tabs activeTab={activeTab} onChange={handleChange}>
        <Tabs.List>
          <Tabs.Tab>Tab one</Tabs.Tab>
          <Tabs.Tab>Tab two</Tabs.Tab>
          <Tabs.Tab disabled>Tab three</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Panel>Panel one</Tabs.Panel>
          <Tabs.Panel>Panel two</Tabs.Panel>
          <Tabs.Panel>Panel three</Tabs.Panel>
        </Tabs.Panels>
      </Tabs>
    </Fragment>
  )
}

describe('Tabs', () => {
  it('Matches snapshot', () => {
    const { asFragment } = render(
      <Tabs id="test" onChange={noop}>
        <Tabs.List>
          <Tabs.Tab>Tab one</Tabs.Tab>
          <Tabs.Tab>Tab two</Tabs.Tab>
          <Tabs.Tab>Tab three</Tabs.Tab>
        </Tabs.List>
      </Tabs>,
    )

    expect(asFragment()).toMatchSnapshot()
  })
  it('Should pass a11y test', async () => {
    const { container } = render(
      <Tabs>
        <Tabs.List>
          <Tabs.Tab>Tab one</Tabs.Tab>
          <Tabs.Tab>Tab two</Tabs.Tab>
          <Tabs.Tab>Tab three</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Panel>Panel one</Tabs.Panel>
          <Tabs.Panel>Panel two</Tabs.Panel>
          <Tabs.Panel>Panel three</Tabs.Panel>
        </Tabs.Panels>
      </Tabs>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
  it('Renders a tablist with three tabs', () => {
    render(
      <Tabs onChange={noop}>
        <Tabs.List>
          <Tabs.Tab>Tab one</Tabs.Tab>
          <Tabs.Tab>Tab two</Tabs.Tab>
          <Tabs.Tab>Tab three</Tabs.Tab>
        </Tabs.List>
      </Tabs>,
    )
    expect(screen.getByRole('tablist')).toBeInTheDocument()
    expect(screen.queryAllByRole('tab')).toHaveLength(3)
  })
  it('Merges forwarded and local refs', () => {
    render(<TabsWithRefs />)
    expect(screen.getByText('Active tab')).toBeInTheDocument()
    expect(screen.getByText('Inactive tab')).toBeInTheDocument()
  })
  it('Switches tabpanel when tab is clicked', () => {
    render(<TabsWithPanels />)
    const targetTab = screen.getByText('Tab two')
    fireEvent.click(targetTab)
    expect(targetTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.queryByText('Panel two')).toBeVisible()
  })
  it('Switches tabpanel when arrow key is clicked', () => {
    render(<TabsWithPanels />)
    const targetTab = screen.getByText('Tab two')
    const tablist = screen.getByRole('tablist')
    fireEvent.keyDown(tablist, {
      key: 'ArrowRight',
    })
    expect(targetTab).toHaveAttribute('aria-selected', 'true')
  })
  it('Skips disabled tabs when navigating using arrowkeys', () => {
    render(<TabsWithPanels selectedTabIndex={1} />)
    const targetTab = screen.getByText('Tab one')
    const tablist = screen.getByRole('tablist')
    fireEvent.keyDown(tablist, {
      key: 'ArrowRight',
    })
    expect(targetTab).toHaveAttribute('aria-selected', 'true')
  })
  it("Doesn't crash if no children is provided", () => {
    const testId = 'tabs'
    render(<Tabs data-testid={testId} />)
    expect(screen.getByTestId(testId)).toBeDefined()
  })
  it("Doesn't crash if no children is provided to Tabs.Panel", () => {
    const testId = 'tabspanel'
    render(
      <Tabs>
        <Tabs.List>
          <Tabs.Tab>Tab one</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Panel data-testid={testId}></Tabs.Panel>
        </Tabs.Panels>
      </Tabs>,
    )
    expect(screen.getByTestId(testId)).toBeDefined()
  })
  it("Doesn't crash if no children is provided to Tabs.Tab", () => {
    const testId = 'tab'
    render(
      <Tabs>
        <Tabs.List>
          <Tabs.Tab data-testid={testId}>Tab one</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Panel>Panel one</Tabs.Panel>
        </Tabs.Panels>
      </Tabs>,
    )
    expect(screen.getByTestId(testId)).toBeDefined()
  })
  it("Doesn't crash if no children is provided to Tabs.List or Tabs.Panels", () => {
    const tablist = 'tablist'
    const tabpanels = 'tabpanels'
    render(
      <Tabs>
        <Tabs.List data-testid={tablist}></Tabs.List>
        <Tabs.Panels data-testid={tabpanels}></Tabs.Panels>
      </Tabs>,
    )
    expect(screen.getByTestId(tablist)).toBeDefined()
    expect(screen.getByTestId(tabpanels)).toBeDefined()
  })
  it("Doesn't crash if null-child is provided to Tabs.List or Tabs.Panels", () => {
    const tablist = 'tablist'
    const tabpanels = 'tabpanels'
    render(
      <Tabs>
        <Tabs.List data-testid={tablist}>
          <Tabs.Tab>First</Tabs.Tab>
          {null}
        </Tabs.List>
        <Tabs.Panels data-testid={tabpanels}>
          <Tabs.Panel>Second</Tabs.Panel>
          {null}
        </Tabs.Panels>
      </Tabs>,
    )
    expect(screen.getByTestId(tablist)).toBeDefined()
    expect(screen.getByTestId(tabpanels)).toBeDefined()
  })
  it("Doesn't crash if only null-child is provided to Tabs.List or Tabs.Panels", () => {
    const tablist = 'tablist'
    const tabpanels = 'tabpanels'
    render(
      <Tabs>
        <Tabs.List data-testid={tablist}>{null}</Tabs.List>
        <Tabs.Panels data-testid={tabpanels}>{null}</Tabs.Panels>
      </Tabs>,
    )
    expect(screen.getByTestId(tablist)).toBeDefined()
    expect(screen.getByTestId(tabpanels)).toBeDefined()
  })
  it('Calls onChange with value when provided, otherwise index', () => {
    const handleChange = jest.fn()
    render(
      <Tabs activeTab="overview" onChange={handleChange}>
        <Tabs.List>
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="details">Details</Tabs.Tab>
          <Tabs.Tab>Plain</Tabs.Tab>
        </Tabs.List>
      </Tabs>,
    )

    fireEvent.click(screen.getByText('Details'))
    expect(handleChange).toHaveBeenLastCalledWith('details')

    fireEvent.click(screen.getByText('Plain'))
    expect(handleChange).toHaveBeenLastCalledWith(2)

    expect(handleChange).toHaveBeenCalledTimes(2)
  })
})
