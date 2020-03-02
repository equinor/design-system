/* eslint-disable no-undef */
import React from 'react'
import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { chips as tokens } from './Chips.tokens'
import { Chips } from '.'

const StyledChips = styled(Chips)`
  position: relative;
`

afterEach(cleanup)

describe('Chips', () => {
  it('Can extend the css for the component', () => {
    const { container } = render(<StyledChips />)
    expect(container.firstChild).toHaveStyleRule('position', 'relative')
  })
})
