/* eslint-disable no-undef */
import React from 'react'
import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { scrim as tokens } from './Scrim.tokens'
import { Scrim } from '.'

const StyledScrim = styled(Scrim)`
  background: red;
`
const { width, height } = tokens

afterEach(cleanup)

describe('Scrim', () => {
  it('Has correct style rules when invisible', () => {
    const { container } = render(<StyledScrim />)
    const scrim = container.firstChild
    expect(scrim).toHaveStyleRule('display', 'none')
  })
  it('Has correct style rules when visible', () => {
    const { container } = render(<StyledScrim isVisible />)
    const scrim = container.firstChild
    expect(scrim).toHaveStyleRule('display', 'flex')
  })
  it('Can extend the css for the component', () => {
    const { container } = render(<StyledScrim isVisible />)
    const scrim = container.firstChild
    expect(scrim).toHaveStyleRule('background', 'red')
    expect(scrim).toHaveStyleRule('width', width)
    expect(scrim).toHaveStyleRule('height', height)
  })
})
