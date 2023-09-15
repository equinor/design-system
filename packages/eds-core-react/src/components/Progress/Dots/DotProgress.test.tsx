/* eslint-disable no-undef */
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import { axe } from 'jest-axe'
import styled from 'styled-components'
import * as tokens from './DotProgress.tokens'
import { DotProgress } from './DotProgress'

const StyledProgress = styled(DotProgress)`
  position: absolute;
`

describe('DotProgress', () => {
  it('Matches snapshot', () => {
    const { asFragment } = render(<DotProgress />)
    expect(asFragment()).toMatchSnapshot()
  })
  it('Should pass a11y test', async () => {
    const { container } = render(<DotProgress />)
    expect(await axe(container)).toHaveNoViolations()
  })
  it('should render neutral as default', () => {
    render(<DotProgress />)
    const progressbar = screen.getByRole('progressbar')
    expect(progressbar).toHaveStyleRule('fill', tokens.neutral.background)
  })
  it('should render primary color if stated in props', () => {
    render(<DotProgress color="primary" />)
    const progressbar = screen.getByRole('progressbar')
    expect(progressbar).toHaveStyleRule('fill', tokens.primary.background)
  })
  it('can extend the css for the component', () => {
    render(<StyledProgress />)
    const progressbar = screen.getByRole('progressbar')
    expect(progressbar).toHaveStyleRule('position', 'absolute')
  })
  it('has correct default size ', () => {
    render(<StyledProgress />)
    const progressbar = screen.getByRole('progressbar')

    expect(progressbar).toHaveAttribute('width', '32')
    expect(progressbar).toHaveAttribute('height', `${32 / 4}`)
  })
  it('has correct size when size is 64', () => {
    render(<StyledProgress size={64} />)
    const progressbar = screen.getByRole('progressbar')

    expect(progressbar).toHaveAttribute('width', '64')
    expect(progressbar).toHaveAttribute('height', `${64 / 4}`)
  })
})
