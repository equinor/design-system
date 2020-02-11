/* eslint-disable no-undef */
import React, { useRef, useEffect, useState, Fragment } from 'react'
import { render, cleanup, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
// import { tabs as tokens } from './Tabs.tokens'
import { Tabs } from '.'

const { TabList, TabPanels, Tab } = Tabs

const noop = () => {}

// const Tabs = () => <div />

afterEach(cleanup)

const TabsWithRefs = () => {
  const activeRef = useRef(null)
  const inactiveRef = useRef(null)

  useEffect(() => {
    activeRef.current.textContent = 'Active tab'
    inactiveRef.current.textContent = 'Inactive tab'
  }, [])

  return (
    <Tabs value={0} onChange={noop}>
      <Tab ref={activeRef}>Tab one</Tab>
      <Tab ref={inactiveRef}>Tab two</Tab>
      <Tab>Tab three</Tab>
    </Tabs>
  )
}

const TabsWithPanels = ({ selectedTabIndex }) => {
  const [value, setValue] = useState(selectedTabIndex)

  const handleChange = (index) => {
    setValue(index)
  }
  const Panel = ({ value, index, children, ...props }) => (
    <div hidden={value !== index} {...props}>
      {children}
    </div>
  )

  return (
    <Fragment>
      <Tabs value={value} onChange={handleChange}>
        <Tab aria-controls="panel-one" id="tab-one">
          Tab one
        </Tab>
        <Tab aria-controls="panel-two" id="tab-two">
          Tab two
        </Tab>
        <Tab aria-controls="panel-three" id="tab-three">
          Tab three
        </Tab>
      </Tabs>
      <Panel
        id="panel-one"
        aria-labelledby="tab-one"
        role="tabpanel"
        tabIndex="0"
        value={value}
        index={0}
      >
        Panel one
      </Panel>
      <Panel
        id="panel-two"
        aria-labelledby="tab-two"
        role="tabpanel"
        tabIndex="0"
        value={value}
        index={1}
      >
        Panel two
      </Panel>
      <Panel
        id="panel-three"
        aria-labelledby="tab-three"
        role="tabpanel"
        tabIndex="0"
        value={value}
        index={2}
      >
        Panel three
      </Panel>
    </Fragment>
  )
}

describe('Tabs', () => {
  it('Renders a tablist with three tabs', () => {
    const { container } = render(
      <Tabs onChange={noop}>
        <Tab>Tab one</Tab>
        <Tab>Tab two</Tab>
        <Tab>Tab three</Tab>
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
    render(<TabsWithPanels selectedTabIndex={0} />)
    const targetTab = screen.queryByText('Tab two')
    fireEvent.click(targetTab)
    expect(targetTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.queryByText('Panel two')).toBeVisible()
  })
  it('Switches tabpanel when arrow key is clicked', () => {
    render(<TabsWithPanels selectedTabIndex={0} />)
    const targetTab = screen.queryByText('Tab two')
    const tablist = screen.queryByRole('tablist')
    fireEvent.keyDown(tablist, {
      key: 'ArrowRight',
    })
    expect(targetTab).toHaveAttribute('aria-selected', 'true')
  })
  it.skip('Skips disabled tabs when navigating using arrowkeys', () => {})
})
