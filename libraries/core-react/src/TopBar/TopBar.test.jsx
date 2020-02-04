/* eslint-disable no-undef */
import React from 'react'
import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { topbar as tokens } from './TopBar.tokens'
import { TopBar } from '.'

const StyledTopBar = styled(TopBar)`
  position: relative;
`
const { height } = tokens

afterEach(cleanup)

describe('TopBar', () => {
  it('Can extend the css for the component', () => {
    const { container } = render(<StyledTopBar />)
    expect(container.firstChild).toHaveStyleRule('position', 'relative')
    expect(container.firstChild).toHaveStyleRule('height', height)
  })
})
