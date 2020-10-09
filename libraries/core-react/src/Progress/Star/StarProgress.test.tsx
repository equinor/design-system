/* eslint-disable no-undef */
import React from 'react'
import { render, cleanup, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { StarProgress } from '..'

const StyledProgress = styled(StarProgress)`
  position: absolute;
`

afterEach(cleanup)

describe('StarProgress', () => {
  it('should render indeterminate as default', () => {
    render(<StarProgress />)
    const progressbar = screen.getByRole('progressbar')
    expect(progressbar).toHaveClass('indeterminate-progress')
  })
  it('should render determinate if stated in props', () => {
    render(<StarProgress variant="determinate" value={50} />)
    const progressbar = screen.getByRole('progressbar')
    expect(progressbar).toHaveClass('determinate-progress')
  })
  it('has aria values on variant=determinate', () => {
    render(<StarProgress variant="determinate" value={50} />)
    const progress = screen.getByRole('progressbar')
    expect(progress).toHaveAttribute('aria-valuenow', '50')
    expect(progress).toHaveAttribute('aria-valuemin', '0')
    expect(progress).toHaveAttribute('aria-valuemax', '100')
  })
  it('can extend the css for the component', () => {
    const { container } = render(<StyledProgress />)
    const progress = container.firstChild
    expect(progress).toHaveStyleRule('position', 'absolute')
  })
})
