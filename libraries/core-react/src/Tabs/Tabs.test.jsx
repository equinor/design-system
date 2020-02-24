/* eslint-disable no-undef */
import React, { useRef, useEffect, useState, Fragment } from 'react'
import PropTypes from 'prop-types'
import { render, cleanup, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import { Tabs } from '.'

const { Tab, Panel } = Tabs

const noop = () => {}

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

  const tabProps = (index) => ({
    id: `tab-${index + 1}`,
    'aria-controls': `panel-${index + 1}`,
  })

  const panelProps = (index) => ({
    index,
    value,
    id: `panel-${index + 1}`,
    'aria-labelledby': `tab-${index + 1}`,
  })

  return (
    <Fragment>
      <Tabs value={value} onChange={handleChange}>
        <Tab {...tabProps(0)}>Tab one</Tab>
        <Tab {...tabProps(1)}>Tab two</Tab>
        <Tab {...tabProps(2)} disabled>
          Tab three
        </Tab>
      </Tabs>
      <Panel {...panelProps(0)}>Panel one</Panel>
      <Panel {...panelProps(1)}>Panel two</Panel>
      <Panel {...panelProps(2)}>Panel three</Panel>
      <Panel {...panelProps(3)}>Panel four</Panel>
    </Fragment>
  )
}

TabsWithPanels.propTypes = {
  selectedTabIndex: PropTypes.number.isRequired,
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
  it('Skips disabled tabs when navigating using arrowkeys', () => {
    render(<TabsWithPanels selectedTabIndex={1} />)
    const targetTab = screen.queryByText('Tab one')
    const tablist = screen.queryByRole('tablist')
    fireEvent.keyDown(tablist, {
      key: 'ArrowRight',
    })
    expect(targetTab).toHaveAttribute('aria-selected', 'true')
  })
})
