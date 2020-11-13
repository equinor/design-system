/* eslint-disable no-undef */
import * as React from 'react'
import { render, cleanup, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { progress as tokens } from '../Progress.tokens'
import { DotProgress } from './DotProgress'

const StyledProgress = styled(DotProgress)`
  position: absolute;
`

const { white, green } = tokens.dots

const rgbaTrim = (x: string) => x.split(' ').join('')

afterEach(cleanup)

describe('DotProgress', () => {
  it('should render white as default', () => {
    render(<DotProgress />)
    const progressbar = screen.getByRole('progressbar')
    expect(progressbar).toHaveStyleRule('fill', `${white.color}`)
  })
  it('should render green variant if stated in props', () => {
    render(<DotProgress variant="green" />)
    const progressbar = screen.getByRole('progressbar')
    expect(progressbar).toHaveStyleRule('fill', rgbaTrim(green.color))
  })
  it('can extend the css for the component', () => {
    render(<StyledProgress />)
    const progressbar = screen.getByRole('progressbar')
    expect(progressbar).toHaveStyleRule('position', 'absolute')
  })
})
