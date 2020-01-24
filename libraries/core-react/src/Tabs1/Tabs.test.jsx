/* eslint-disable no-undef */
import React from 'react'
import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
// import { tabs as tokens } from './Tabs.tokens'
import { Tabs } from '.'

const { TabList, TabPanels, Tab } = Tabs

// const Tabs = () => <div />

afterEach(cleanup)

describe('Tabs', () => {
  it('Renders', () => {
    const { debug } = render(
      <Tabs>
        <Tab>Tab one</Tab>
        <Tab>Tab two</Tab>
        <Tab>Tab three</Tab>
      </Tabs>,
    )
    debug()
  })
})
