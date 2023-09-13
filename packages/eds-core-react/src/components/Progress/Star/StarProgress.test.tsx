/* eslint-disable no-undef */
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import { axe } from 'jest-axe'
import { styled } from 'styled-components'
import { StarProgress } from './StarProgress'

const StyledProgress = styled(StarProgress)`
  position: absolute;
`

describe('StarProgress', () => {
  it('Matches snapshot', () => {
    const { asFragment } = render(<StarProgress />)
    expect(asFragment()).toMatchSnapshot()
  })
  it('Should pass a11y test', async () => {
    const { container } = render(<StarProgress />)
    expect(await axe(container)).toHaveNoViolations()
  })
  it('Should pass a11y test with variant & value', async () => {
    const { container } = render(
      <StarProgress variant="determinate" value={50} />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
  it('has correct aria values when variant is "determinate"', () => {
    render(<StarProgress variant="determinate" value={50} />)
    const progressbar = screen.getByRole('progressbar')
    expect(progressbar).toHaveAttribute('aria-valuenow', '50')
    expect(progressbar).toHaveAttribute('aria-valuemin', '0')
    expect(progressbar).toHaveAttribute('aria-valuemax', '100')
  })
  it('can extend the css for the component', () => {
    render(<StyledProgress />)
    const progressbar = screen.getByRole('progressbar')

    expect(progressbar).toHaveStyleRule('position', 'absolute')
  })
  it('has correct default width ', () => {
    render(<StarProgress />)
    const progressbar = screen.getByRole('progressbar')

    expect(progressbar).toHaveAttribute('width', '48')
  })
  it('has correct width when size is 16', () => {
    render(<StarProgress size={16} />)
    const progressbar = screen.getByRole('progressbar')

    expect(progressbar).toHaveAttribute('width', '16')
  })
})
