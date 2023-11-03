import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import styled from 'styled-components'
import { CircularProgress } from './CircularProgress'
import * as tokens from './CircularProgress.tokens'

const StyledProgress = styled(CircularProgress)`
  position: absolute;
`

describe('CircularProgress', () => {
  it('Matches snapshot', () => {
    const { asFragment } = render(<StyledProgress />)
    expect(asFragment()).toMatchSnapshot()
  })
  it('Should pass a11y test', async () => {
    const { container } = render(<CircularProgress />)
    expect(await axe(container)).toHaveNoViolations()
  })
  it('Should pass a11y test with variant & value', async () => {
    const { container } = render(
      <CircularProgress variant="determinate" value={50} />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
  it('has correct aria values when variant is "determinate"', () => {
    render(<CircularProgress variant="determinate" value={50} />)
    const progress = screen.getByRole('progressbar')
    expect(progress).toHaveAttribute('aria-valuenow', '50')
    expect(progress).toHaveAttribute('aria-valuemin', '0')
    expect(progress).toHaveAttribute('aria-valuemax', '100')
  })
  it('can extend the css for the component', () => {
    render(<StyledProgress />)
    const progressbar = screen.getByRole('progressbar')

    expect(progressbar).toHaveStyleRule('position', 'absolute')
  })
  it('has primary as default color', () => {
    render(<CircularProgress />)
    const progressbar = screen.getByRole('progressbar')

    const trackCircle = progressbar.childNodes[0]
    const progressCircle = progressbar.childNodes[1]
    expect(trackCircle).toHaveAttribute('stroke', tokens.primary.background)
    expect(progressCircle).toHaveAttribute(
      'stroke',
      tokens.primary.entities.progress.background,
    )
  })
  it('has correct neutral color', () => {
    render(<CircularProgress color="neutral" />)
    const progressbar = screen.getByRole('progressbar')

    const trackCircle = progressbar.childNodes[0]
    const progressCircle = progressbar.childNodes[1]
    expect(trackCircle).toHaveAttribute('stroke', tokens.neutral.background)
    expect(progressCircle).toHaveAttribute(
      'stroke',
      tokens.neutral.entities.progress.background,
    )
  })
  it('has correct default size of 48x48', () => {
    render(<CircularProgress />)
    const progressbar = screen.getByRole('progressbar')

    expect(progressbar).toHaveAttribute('height', '48')
    expect(progressbar).toHaveAttribute('width', '48')
  })
  it('has correct size when set to 16', () => {
    render(<CircularProgress size={16} />)
    const progressbar = screen.getByRole('progressbar')

    expect(progressbar).toHaveAttribute('height', '16')
    expect(progressbar).toHaveAttribute('width', '16')
  })
})
