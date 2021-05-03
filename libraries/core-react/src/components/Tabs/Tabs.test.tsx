/* eslint-disable no-undef */
import { useRef, useEffect, useState, Fragment } from 'react'
import { render, cleanup, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import { Tabs } from '.'

const noop = () => null

afterEach(cleanup)

const TabsWithRefs = () => {
  const activeRef = useRef<HTMLButtonElement>(null)
  const inactiveRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    activeRef.current.textContent = 'Active tab'
    inactiveRef.current.textContent = 'Inactive tab'
  }, [])

  return (
    <Tabs activeTab={0} onChange={noop}>
      <Tabs.List>
        <Tabs.Tab ref={activeRef}>Tabs.Tab one</Tabs.Tab>
        <Tabs.Tab ref={inactiveRef}>Tabs.Tab two</Tabs.Tab>
        <Tabs.Tab>Tabs.Tab three</Tabs.Tab>
      </Tabs.List>
    </Tabs>
  )
}

const TabsWithPanels = ({
  selectedTabIndex = 0,
}: {
  selectedTabIndex?: number
}) => {
  const [activeTab, setActiveTab] = useState(selectedTabIndex)

  const handleChange = (index) => {
    setActiveTab(index)
  }

  return (
    <Fragment>
      <Tabs activeTab={activeTab} onChange={handleChange}>
        <Tabs.List>
          <Tabs.Tab>Tabs.Tab one</Tabs.Tab>
          <Tabs.Tab>Tabs.Tab two</Tabs.Tab>
          <Tabs.Tab disabled>Tabs.Tab three</Tabs.Tab>
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
  it('Renders a tablist with three tabs', () => {
    const { container } = render(
      <Tabs onChange={noop}>
        <Tabs.List>
          <Tabs.Tab>Tabs.Tab one</Tabs.Tab>
          <Tabs.Tab>Tabs.Tab two</Tabs.Tab>
          <Tabs.Tab>Tabs.Tab three</Tabs.Tab>
        </Tabs.List>
      </Tabs>,
    )
    expect(screen.queryByRole('tablist')).toBeInTheDocument()
    expect(container.querySelectorAll('[role = "tab"]')).toHaveLength(3)
  })
  it('Merges forwarded and local refs', () => {
    render(<TabsWithRefs />)
    expect(screen.queryByText('Active tab')).toBeInTheDocument()
    expect(screen.queryByText('Inactive tab')).toBeInTheDocument()
  })
  it('Switches tabpanel when tab is clicked', () => {
    render(<TabsWithPanels />)
    const targetTab = screen.queryByText('Tabs.Tab two')
    fireEvent.click(targetTab)
    expect(targetTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.queryByText('Panel two')).toBeVisible()
  })
  it('Switches tabpanel when arrow key is clicked', () => {
    render(<TabsWithPanels />)
    const targetTab = screen.queryByText('Tabs.Tab two')
    const tablist = screen.queryByRole('tablist')
    fireEvent.keyDown(tablist, {
      key: 'ArrowRight',
    })
    expect(targetTab).toHaveAttribute('aria-selected', 'true')
  })
  it('Skips disabled tabs when navigating using arrowkeys', () => {
    render(<TabsWithPanels selectedTabIndex={1} />)
    const targetTab = screen.queryByText('Tabs.Tab one')
    const tablist = screen.queryByRole('tablist')
    fireEvent.keyDown(tablist, {
      key: 'ArrowRight',
    })
    expect(targetTab).toHaveAttribute('aria-selected', 'true')
  })
  it("Doesn't crash if no children is provided", () => {
    const testId = 'tabs'
    render(<Tabs data-testid={testId} />)
    expect(screen.queryByTestId(testId)).toBeDefined()
  })
  it("Doesn't crash if no children is provided to Tabs.Panel", () => {
    const testId = 'tabspanel'
    render(
      <Tabs>
        <Tabs.List>
          <Tabs.Tab>Tabs.Tab one</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Panel data-testid={testId}></Tabs.Panel>
        </Tabs.Panels>
      </Tabs>,
    )
    expect(screen.queryByTestId(testId)).toBeDefined()
  })
  it("Doesn't crash if no children is provided to Tabs.Tab", () => {
    const testId = 'tab'
    render(
      <Tabs>
        <Tabs.List>
          <Tabs.Tab data-testid={testId}>Tabs.Tab one</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Panel>Panel one</Tabs.Panel>
        </Tabs.Panels>
      </Tabs>,
    )
    expect(screen.queryByTestId(testId)).toBeDefined()
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
    expect(screen.queryByTestId(tablist)).toBeDefined()
    expect(screen.queryByTestId(tabpanels)).toBeDefined()
  })
})
