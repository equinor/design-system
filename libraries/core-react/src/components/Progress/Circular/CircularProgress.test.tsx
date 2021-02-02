import * as React from 'react'
import { render, cleanup, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { CircularProgress } from './CircularProgress'
import * as tokens from './CircularProgress.tokens'

const StyledProgress = styled(CircularProgress)`
  position: absolute;
`

afterEach(cleanup)

describe('CircularProgress', () => {
  it('has correct aria values when variant is "determinate"', () => {
    render(<CircularProgress variant="determinate" value={50} />)
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
  it('has primary as default color', () => {
    const { container } = render(<CircularProgress />)
    const progress = container.firstChild
    const trackCircle = progress.childNodes[0]
    const progressCircle = progress.childNodes[1]
    expect(trackCircle).toHaveAttribute('stroke', tokens.primary.background)
    expect(progressCircle).toHaveAttribute(
      'stroke',
      tokens.primary.entities.progress.background,
    )
  })
  it('has correct neutral color', () => {
    const { container } = render(<CircularProgress color="neutral" />)
    const progress = container.firstChild
    const trackCircle = progress.childNodes[0]
    const progressCircle = progress.childNodes[1]
    expect(trackCircle).toHaveAttribute('stroke', tokens.neutral.background)
    expect(progressCircle).toHaveAttribute(
      'stroke',
      tokens.neutral.entities.progress.background,
    )
  })
  it('has correct default size of 48x48', () => {
    const { container } = render(<CircularProgress />)
    const progress = container.firstChild
    expect(progress).toHaveAttribute('height', '48')
    expect(progress).toHaveAttribute('width', '48')
  })
  it('has correct size when set to 16', () => {
    const { container } = render(<CircularProgress size={16} />)
    const progress = container.firstChild
    expect(progress).toHaveAttribute('height', '16')
    expect(progress).toHaveAttribute('width', '16')
  })
})
