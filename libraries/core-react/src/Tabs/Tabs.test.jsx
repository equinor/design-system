/* eslint-disable no-undef */
import React from 'react'
import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import { tabs as tokens } from './Tabs.tokens'
import { Tabs } from '.'

afterEach(cleanup)

describe('Tabs', () => {
  it('Renders', () => {
    const { container } = render(<Tabs />)
    debug()
  })
})
