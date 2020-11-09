/* eslint-disable no-undef */
import { useRef, useEffect, useState, Fragment } from 'react'
import PropTypes from 'prop-types'
import { render, cleanup, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import { Tabs } from '.'

const { TabList, Tab, TabPanels, TabPanel } = Tabs

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
      <TabList>
        <Tab ref={activeRef}>Tab one</Tab>
        <Tab ref={inactiveRef}>Tab two</Tab>
        <Tab>Tab three</Tab>
      </TabList>
    </Tabs>
  )
}

const TabsWithPanels = ({ selectedTabIndex = 0 }) => {
  const [activeTab, setActiveTab] = useState(selectedTabIndex)

  const handleChange = (index) => {
    setActiveTab(index)
  }

  return (
    <Fragment>
      <Tabs activeTab={activeTab} onChange={handleChange}>
        <TabList>
          <Tab>Tab one</Tab>
          <Tab>Tab two</Tab>
          <Tab disabled>Tab three</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>Panel one</TabPanel>
          <TabPanel>Panel two</TabPanel>
          <TabPanel>Panel three</TabPanel>
        </TabPanels>
      </Tabs>
    </Fragment>
  )
}

TabsWithPanels.propTypes = {
  selectedTabIndex: PropTypes.number,
}

TabsWithPanels.defaultProps = {
  selectedTabIndex: 0,
}

describe('Tabs', () => {
  it('Renders a tablist with three tabs', () => {
    const { container } = render(
      <Tabs onChange={noop}>
        <TabList>
          <Tab>Tab one</Tab>
          <Tab>Tab two</Tab>
          <Tab>Tab three</Tab>
        </TabList>
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
    const targetTab = screen.queryByText('Tab two')
    fireEvent.click(targetTab)
    expect(targetTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.queryByText('Panel two')).toBeVisible()
  })
  it('Switches tabpanel when arrow key is clicked', () => {
    render(<TabsWithPanels />)
    const targetTab = screen.queryByText('Tab two')
    const tablist = screen.queryByRole('tablist')
    fireEvent.keyDown(tablist, {
      key: 'ArrowRight',
    })
    expect(targetTab).toHaveAttribute('aria-selected', 'true')
  })
  it('Skips disabled tabs when navigating using arrowkeys', () => {
    render(<TabsWithPanels selectedTabIndex={1} />)
    const targetTab = screen.queryByText('Tab one')
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
  it("Doesn't crash if no children is provided to TabPanel", () => {
    const testId = 'tabspanel'
    render(
      <Tabs>
        <TabList>
          <Tab>Tab one</Tab>
        </TabList>
        <TabPanels>
          <TabPanel data-testid={testId}></TabPanel>
        </TabPanels>
      </Tabs>,
    )
    expect(screen.queryByTestId(testId)).toBeDefined()
  })
  it("Doesn't crash if no children is provided to Tab", () => {
    const testId = 'tab'
    render(
      <Tabs>
        <TabList>
          <Tab data-testid={testId}>Tab one</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>Panel one</TabPanel>
        </TabPanels>
      </Tabs>,
    )
    expect(screen.queryByTestId(testId)).toBeDefined()
  })
  it("Doesn't crash if no children is provided to TabList or TabPanels", () => {
    const tablist = 'tablist'
    const tabpanels = 'tabpanels'
    render(
      <Tabs>
        <TabList data-testid={tablist}></TabList>
        <TabPanels data-testid={tabpanels}></TabPanels>
      </Tabs>,
    )
    expect(screen.queryByTestId(tablist)).toBeDefined()
    expect(screen.queryByTestId(tabpanels)).toBeDefined()
  })
})
