import { render, screen, act } from '@testing-library/react'
import { axe } from 'jest-axe'
import styled from 'styled-components'
import { SideSheet } from '.'

const StyledSidesheet = styled(SideSheet)`
  position: relative;
  height: 100px;
  width: 100px;
`

describe('SideSheet', () => {
  it('Matches snapshot', () => {
    const { asFragment } = render(
      <SideSheet open variant="large" title="Title" onClose={jest.fn()} />,
    )
    expect(asFragment()).toMatchSnapshot()
  })
  it('Should pass a11y test', async () => {
    const { container } = render(<SideSheet open title="Title" />)
    await act(async () => {
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
  it('Has correct width', () => {
    render(
      <SideSheet open variant="large" title="Title" data-testid="sidesheet" />,
    )
    expect(screen.getByTestId('sidesheet')).toHaveStyleRule('width', '480px')
  })
  it('Has provided necessary props', () => {
    const title = 'Title'
    const variant = 'large'
    render(<SideSheet open variant={variant} title={title} />)
    expect(screen.getByText(title)).toBeDefined()
  })
  it('Can extend the css for the component', () => {
    render(<StyledSidesheet open data-testid="sidesheet" />)
    const sidesheet = screen.getByTestId('sidesheet')
    expect(sidesheet).toHaveStyleRule('position', 'relative')
    expect(sidesheet).toHaveStyleRule('height', '100px')
    expect(sidesheet).toHaveStyleRule('width', '100px')
  })
})
