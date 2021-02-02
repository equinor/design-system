/* eslint-disable no-undef */
import * as React from 'react'
import { render, cleanup, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import * as tokens from './DotProgress.tokens'
import { DotProgress } from './DotProgress'
import { trimSpaces } from '@utils'

const StyledProgress = styled(DotProgress)`
  position: absolute;
`

afterEach(cleanup)

describe('DotProgress', () => {
  it('should render neutral as default', () => {
    render(<DotProgress />)
    const progressbar = screen.getByRole('progressbar')
    expect(progressbar).toHaveStyleRule(
      'fill',
      trimSpaces(tokens.neutral.background),
    )
  })
  it('should render primary color if stated in props', () => {
    render(<DotProgress color="primary" />)
    const progressbar = screen.getByRole('progressbar')
    expect(progressbar).toHaveStyleRule(
      'fill',
      trimSpaces(tokens.primary.background),
    )
  })
  it('can extend the css for the component', () => {
    render(<StyledProgress />)
    const progressbar = screen.getByRole('progressbar')
    expect(progressbar).toHaveStyleRule('position', 'absolute')
  })
})
