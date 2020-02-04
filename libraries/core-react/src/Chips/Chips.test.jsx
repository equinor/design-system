/* eslint-disable no-undef */
import React from 'react'
import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { chips as tokens } from './Chips.tokens'
import { Chips } from '.'

afterEach(cleanup)

describe('Chips', () => {
  it('Does stuff', () => {
    const { debug } = render(<Chips />)
    debug()
  })
})
