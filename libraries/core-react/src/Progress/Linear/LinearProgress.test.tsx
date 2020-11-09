/* eslint-disable no-undef */
import { render, cleanup, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { LinearProgress } from './LinearProgress'

const StyledProgress = styled(LinearProgress)`
  position: absolute;
`

afterEach(cleanup)

describe('LinearProgress ', () => {
  it('should render indeterminate as default', () => {
    render(<LinearProgress />)
    const progress = screen.getByRole('progressbar')
    expect(progress).toHaveClass('indeterminate-progress')
  })
  it('should render determinate if stated in props', () => {
    render(<LinearProgress variant="determinate" value={50} />)
    const progress = screen.getByRole('progressbar')
    expect(progress).toHaveClass('determinate-progress')
  })
  it('has aria values on variant=determinate', () => {
    render(<LinearProgress variant="determinate" value={50} />)
    const progress = screen.getByRole('progressbar')
    expect(progress).toHaveAttribute('aria-valuenow', '50')
    expect(progress).toHaveAttribute('aria-valuemin', '0')
    expect(progress).toHaveAttribute('aria-valuemax', '100')
  })
  it('can extend the css for the component', () => {
    render(<StyledProgress />)
    const progress = screen.getByRole('progressbar')
    expect(progress).toHaveStyleRule('position', 'absolute')
  })
})
