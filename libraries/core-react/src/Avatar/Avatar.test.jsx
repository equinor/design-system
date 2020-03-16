/* eslint-disable no-undef */
import React from 'react'
import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { Avatar } from '.'
import { avatar as tokens } from './Avatar.tokens'

const {
  disabled: { image: disabledImage },
} = tokens

const StyledAvatar = styled(Avatar)`
  position: relative;
`

/* <Avatar src="https://i.imgur.com/UM3mrju.jpg"></Avatar> */

afterEach(cleanup)

describe('Avatar', () => {
  it('Can extend the css for the component', () => {
    const { container } = render(<StyledAvatar />)
    expect(container.firstChild).toHaveStyleRule('position', 'relative')
  })
  it('Image has provided src', () => {
    const src = 'https://i.imgur.com/UM3mrju.jpg'
    const { container } = render(<Avatar src={src} />)
    const avatarImg = container.firstChild.children[0]
    expect(avatarImg).toHaveAttribute('src', src)
  })
  it('Has correct size', () => {
    const src = 'https://i.imgur.com/UM3mrju.jpg'
    const size = 32
    const { container } = render(<Avatar src={src} size={size} />)
    const avatar = container.firstChild
    expect(avatar).toHaveStyleRule('width', `${size}px`)
    expect(avatar).toHaveStyleRule('height', `${size}px`)
  })
  it('Has faded image when disabled', () => {
    const src = 'https://i.imgur.com/UM3mrju.jpg'
    const { container } = render(<Avatar disabled src={src} />)
    const avatarImg = container.firstChild.children[0]
    expect(avatarImg).toHaveStyleRule('opacity', disabledImage.opacity)
  })
})
