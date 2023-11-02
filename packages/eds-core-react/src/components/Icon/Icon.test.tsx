/* eslint-disable no-undef */
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import styled from 'styled-components'
import { save } from '@equinor/eds-icons'
import { Icon } from '.'

Icon.add({ save })

const StyledIcon = styled(Icon)`
  position: relative;
  height: 100px;
  width: 100px;
`

describe('Icon', () => {
  it('Matches snapshot using data', () => {
    const { asFragment } = render(<Icon data={save} />)
    expect(asFragment()).toMatchSnapshot()
  })
  it('Should pass a11y test using data', async () => {
    const { container } = render(<Icon data={save} />)
    expect(await axe(container)).toHaveNoViolations()
  })
  it('Should pass a11y test using name', async () => {
    const { container } = render(<Icon name="save" />)
    expect(await axe(container)).toHaveNoViolations()
  })
  it('Should pass a11y test using title', async () => {
    const title = 'Save me'
    const { container } = render(<Icon name="save" title={title} />)
    expect(await axe(container)).toHaveNoViolations()
  })
  it('Matches snapshot using name ', () => {
    const { asFragment } = render(<Icon name="save" />)
    expect(asFragment()).toMatchSnapshot()
  })
  it('Has correct svg data', () => {
    render(<Icon name="save" />)
    expect(screen.queryByTestId('eds-icon-path')).toHaveAttribute(
      'd',
      save.svgPathData,
    )
  })
  it('Has correct svg data when using data property', () => {
    render(<Icon data={save} />)

    expect(screen.queryByTestId('eds-icon-path')).toHaveAttribute(
      'd',
      save.svgPathData,
    )
  })
  it('Has correct color', () => {
    render(<Icon name="save" color="red" title="icon" />)

    expect(screen.getByLabelText('icon')).toHaveAttribute('fill', 'red')
  })
  it('Has correct size', () => {
    render(<Icon name="save" size={48} title="icon" />)
    const icon = screen.getByLabelText('icon')

    expect(icon).toHaveAttribute('height', '48px')
    expect(icon).toHaveAttribute('width', '48px')
  })
  it('Has correct elements when using title', () => {
    const title = 'Save me'
    render(<Icon name="save" title={title} />)
    const icon = screen.getByLabelText(title)

    expect(icon).toHaveAttribute('aria-labelledby')
    expect(icon).toHaveAttribute('role', 'img')
    expect(screen.queryAllByTitle(title)).toHaveLength(2)
  })
  it('Can extend the css for the component', () => {
    render(<StyledIcon name="save" title="icon" />)
    const icon = screen.getByLabelText('icon')
    expect(icon).toHaveStyleRule('position', 'relative')
    expect(icon).toHaveStyleRule('height', '100px')
    expect(icon).toHaveStyleRule('width', '100px')
  })
})
