/* eslint-disable no-undef */
import { render, cleanup, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { StarProgress } from './StarProgress'

const StyledProgress = styled(StarProgress)`
  position: absolute;
`

afterEach(cleanup)

describe('StarProgress', () => {
  it('Matches snapshot', () => {
    const { asFragment } = render(<StarProgress />)
    expect(asFragment()).toMatchSnapshot()
  })
  it('has correct aria values when variant is "determinate"', () => {
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
  it('has correct default width ', () => {
    const { container } = render(<StarProgress />)
    const progress = container.firstChild
    expect(progress).toHaveAttribute('width', '48')
  })
  it('has correct width when size is 16', () => {
    const { container } = render(<StarProgress size={16} />)
    const progress = container.firstChild
    expect(progress).toHaveAttribute('width', '16')
  })
})
