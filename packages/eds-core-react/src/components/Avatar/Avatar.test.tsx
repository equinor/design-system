/* eslint-disable no-undef */
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import styled from 'styled-components'
import { Avatar } from '.'
import { avatar as tokens } from './Avatar.tokens'

const StyledAvatar = styled(Avatar)`
  position: relative;
`

describe('Avatar', () => {
  it('Matches snapshot', () => {
    const src = 'https://i.imgur.com/UM3mrju.jpg'
    const { asFragment } = render(<Avatar alt="avatar" src={src} />)

    expect(asFragment()).toMatchSnapshot()
  })
  it('Should pass a11y test', async () => {
    const { container } = render(<Avatar alt="avatar" />)
    expect(await axe(container)).toHaveNoViolations()
  })
  it('Can extend the css for the component', () => {
    render(<StyledAvatar alt="avatar" data-testid="avatar" />)
    const avatar = screen.getByTestId('avatar')

    expect(avatar).toHaveStyleRule('position', 'relative')
  })
  it('Image has provided src', () => {
    const src = 'https://i.imgur.com/UM3mrju.jpg'
    render(<Avatar alt="avatar" src={src} />)
    const avatarImg = screen.getByAltText('avatar')

    expect(avatarImg).toHaveAttribute('src', src)
  })
  it('Has correct size', () => {
    const src = 'https://i.imgur.com/UM3mrju.jpg'
    const size = 32
    render(<Avatar src={src} size={size} alt="avatar" data-testid="avatar" />)
    const avatar = screen.getByTestId('avatar')

    expect(avatar).toHaveStyleRule('width', `${size}px`)
    expect(avatar).toHaveStyleRule('height', `${size}px`)
  })
  it('Has faded image when disabled', () => {
    const altText = 'avatar'
    const src = 'https://i.imgur.com/UM3mrju.jpg'
    render(<Avatar disabled src={src} alt={altText} />)
    const avatarImg = screen.getByAltText(altText)

    expect(avatarImg).toHaveStyleRule('opacity', tokens.states.disabled.opacity)
  })
})
