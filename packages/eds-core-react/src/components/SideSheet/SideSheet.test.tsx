import { render, cleanup, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import { axe } from 'jest-axe'
import styled from 'styled-components'
import { SideSheet } from '.'

const StyledSidesheet = styled(SideSheet)`
  position: relative;
  height: 100px;
  width: 100px;
`

afterEach(cleanup)

describe('SideSheet', () => {
  it('Matches snapshot', () => {
    const { asFragment } = render(<SideSheet variant="large" title="Title" />)
    expect(asFragment()).toMatchSnapshot()
  })
  it('Should pass a11y test', async () => {
    const { container } = render(<SideSheet title="Title" />)
    await act(async () => {
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
  it('Has correct width', () => {
    render(<SideSheet variant="large" title="Title" data-testid="sidesheet" />)
    expect(screen.getByTestId('sidesheet')).toHaveStyleRule('width', '480px')
  })
  it('Has provided necessary props', () => {
    const title = 'Title'
    const variant = 'large'
    render(<SideSheet variant={variant} title={title} />)
    expect(screen.getByText(title)).toBeDefined()
  })
  it('Can extend the css for the component', () => {
    render(<StyledSidesheet data-testid="sidesheet" />)
    const sidesheet = screen.getByTestId('sidesheet')
    expect(sidesheet).toHaveStyleRule('position', 'relative')
    expect(sidesheet).toHaveStyleRule('height', '100px')
    expect(sidesheet).toHaveStyleRule('width', '100px')
  })
})
