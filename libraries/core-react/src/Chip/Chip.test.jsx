/* eslint-disable no-undef */
import React from 'react'
import { render, cleanup, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { add } from '@equinor/eds-icons'
import { Chip } from '.'
import { Avatar, Icon } from '..'
import { chip as tokens } from './Chip.tokens'

Icon.add({ add })

const StyledChips = styled(Chip)`
  position: relative;
`

const { active: activeToken, error } = tokens

const rgbaTrim = (x) => x.split(' ').join('')

afterEach(cleanup)

describe('Chips', () => {
  it('Can extend the css for the component', () => {
    const { container } = render(<StyledChips />)
    expect(container.firstChild).toHaveStyleRule('position', 'relative')
  })
  it('Has provided text', () => {
    const chipText = 'hello, I am a chip'
    const { queryByText } = render(<Chip>{chipText}</Chip>)
    expect(queryByText(chipText)).toBeDefined()
  })
  it('Has provided Icon', () => {
    const chipText = 'hello, I am a chip'
    const iconTestId = 'avatar-chip-test'
    const { queryByText, queryByTestId } = render(
      <Chip>
        <Icon name="add" data-testid={iconTestId} />
        {chipText}
      </Chip>,
    )
    expect(queryByText(chipText)).toBeDefined()
    expect(queryByTestId(iconTestId)).toBeDefined()
  })
  it('Has provided Avatar', () => {
    const chipText = 'hello, I am a chip'
    const avatarTestId = 'avatar-chip-test'
    const imageUrl = 'https://i.imgur.com/UM3mrju.jpg'
    const { queryByText, queryByTestId } = render(
      <Chip>
        <Avatar src={imageUrl} data-testid={avatarTestId} />
        {chipText}
      </Chip>,
    )
    expect(queryByText(chipText)).toBeDefined()
    expect(queryByTestId(avatarTestId)).toBeDefined()
    expect(queryByTestId(avatarTestId).firstChild).toHaveAttribute(
      'src',
      imageUrl,
    )
  })
  it('Has called handleDelete once with props when close icon is clicked', () => {
    const chipText = 'hello, I am a chip'
    const chipId = 'avatar-chip-test'
    let callbackId = ''
    const handleDelete = jest.fn((x) => {
      callbackId = x.id
    })

    const { queryAllByTitle } = render(
      <Chip id={chipId} onDelete={handleDelete}>
        {chipText}
      </Chip>,
    )

    const closeIcon = queryAllByTitle('close')[0]

    fireEvent.click(closeIcon)

    expect(handleDelete).toHaveBeenCalled()
    expect(callbackId).toEqual(chipId)
  })
  it('Has called handleClick once with props when clicked', () => {
    const chipText = 'hello, I am a chip'
    const chipId = 'avatar-chip-test'
    let callbackId = ''
    const handleClick = jest.fn((x) => {
      callbackId = x.id
    })

    const { container } = render(
      <Chip id={chipId} onClick={handleClick}>
        {chipText}
      </Chip>,
    )

    fireEvent.click(container.firstChild)

    expect(handleClick).toHaveBeenCalled()
    expect(callbackId).toEqual(chipId)
  })
  it('Has called handleClick once with props when pressed Enter', () => {
    const chipText = 'hello, I am a chip'
    const chipId = 'avatar-chip-test'
    let callbackId = ''
    const handleClick = jest.fn((x) => {
      callbackId = x.id
    })

    const { container } = render(
      <Chip id={chipId} onClick={handleClick}>
        {chipText}
      </Chip>,
    )

    fireEvent.click(container.firstChild, {
      key: 'Enter',
    })

    expect(handleClick).toHaveBeenCalled()
    expect(callbackId).toEqual(chipId)
  })
  it('Has correct active styling', () => {
    const chipText = 'hello, I am a chip'
    const { queryByText } = render(<Chip variant="active">{chipText}</Chip>)
    expect(queryByText(chipText)).toHaveStyleRule(
      'background',
      rgbaTrim(activeToken.background),
    )
  })
  it('Has some correct error styling', () => {
    const chipText = 'hello, I am a chip'
    const iconTestId = 'avatar-chip-test'

    render(
      <Chip variant="error">
        <Icon name="add" data-testid={iconTestId} />
        {chipText}
      </Chip>,
    )
    const chip = screen.queryByText(chipText)
    const chipIconStyle = window.getComputedStyle(
      screen.queryByTestId(iconTestId),
    )

    expect(chip).toHaveStyleRule('background', rgbaTrim(error.background))
    expect(chip).toHaveStyleRule('border-color', rgbaTrim(error.border.color))
    expect(chip).toHaveStyleRule('color', rgbaTrim(error.typography.color))
    expect(chipIconStyle.fill).toBe(rgbaTrim(error.icon.color))
  })
})
