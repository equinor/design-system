/* eslint-disable no-undef */
import { render, cleanup, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { axe } from 'jest-axe'
import 'jest-styled-components'
import styled from 'styled-components'
import { LinearProgress } from './LinearProgress'

const StyledProgress = styled(LinearProgress)`
  position: absolute;
`

afterEach(cleanup)

describe('LinearProgress ', () => {
  it('Matches snapshot', () => {
    const { asFragment } = render(<LinearProgress />)
    expect(asFragment()).toMatchSnapshot()
  })
  it('Should pass a11y test', async () => {
    const { container } = render(<LinearProgress aria-label="Label text" />)
    expect(await axe(container)).toHaveNoViolations()
  })
  it('has coorect aria values when variant is "determinate"', () => {
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
