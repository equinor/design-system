import { render, fireEvent, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import styled from 'styled-components'
import { add } from '@equinor/eds-icons'
import { Chip } from './Chip'
import { Avatar } from '../Avatar'
import { Icon } from '../Icon'
import * as tokens from './Chip.tokens'

const StyledChips = styled(Chip)`
  position: relative;
`

const { enabled, error } = tokens

describe('Chips', () => {
  it('Matches snapshot', () => {
    const { asFragment } = render(
      <Chip>
        <Icon data={add} />
        Chip
      </Chip>,
    )
    expect(asFragment()).toMatchSnapshot()

    const { asFragment: asFragment2 } = render(
      <Chip
        onClick={() => {
          jest.fn()
        }}
      >
        <Icon data={add} />
        Chip
      </Chip>,
    )
    expect(asFragment2()).toMatchSnapshot()
  })
  it('Can extend the css for the component', () => {
    render(<StyledChips>styled chip</StyledChips>)
    expect(screen.getByText('styled chip')).toHaveStyleRule(
      'position',
      'relative',
    )
  })
  it('Should pass a11y test', async () => {
    const { container } = render(<Chip>I am chip</Chip>)
    expect(await axe(container)).toHaveNoViolations()
  })
  it('Should pass a11y test when has icon', async () => {
    const { container } = render(
      <Chip>
        <Icon data={add} />I am chip
      </Chip>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
  it('Should pass a11y test when has avatar', async () => {
    const imageUrl = 'https://i.imgur.com/UM3mrju.jpg'
    const { container } = render(
      <Chip>
        <Avatar src={imageUrl} alt="avatar" />I am chip
      </Chip>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
  it('Has provided text', () => {
    const chipText = 'hello, I am a chip'
    render(<Chip>{chipText}</Chip>)
    expect(screen.getByText(chipText)).toBeDefined()
  })
  it('Has provided Icon', () => {
    const chipText = 'hello, I am a chip'
    const iconTestId = 'avatar-chip-test'
    render(
      <Chip>
        <Icon data={add} data-testid={iconTestId} />
        {chipText}
      </Chip>,
    )
    expect(screen.getByText(chipText)).toBeDefined()
    expect(screen.getByTestId(iconTestId)).toBeDefined()
  })
  it('Has correct styling when Icon is provided', () => {
    const chipText = 'hello, I am a chip'
    const iconTestId = 'avatar-chip-test'
    render(
      <Chip>
        <Icon data={add} data-testid={iconTestId} />
        {chipText}
      </Chip>,
    )
    const chip = screen.queryByText(chipText)
    const icon = screen.queryByTestId(iconTestId)

    expect(chip).toBeDefined()
    expect(chip).toHaveStyleRule('padding-left', '4px')
    expect(chip).toHaveStyleRule('padding-right', enabled.spacings.right)
    expect(chip).toHaveStyleRule(
      'border-radius',
      enabled.border.type === 'border' && enabled.border.radius,
    )
    expect(icon).toBeDefined()
    expect(icon).toHaveAttribute('height', enabled.entities.icon.height)
    expect(icon).toHaveAttribute('width', enabled.entities.icon.width)
  })
  it('Has provided Avatar', () => {
    const chipText = 'hello, I am a chip'
    const avatarTestId = 'avatar-chip-test'
    const imageUrl = 'https://i.imgur.com/UM3mrju.jpg'
    render(
      <Chip>
        <Avatar src={imageUrl} data-testid={avatarTestId} alt="avatar" />
        {chipText}
      </Chip>,
    )
    expect(screen.getByText(chipText)).toBeDefined()
    expect(screen.getByTestId(avatarTestId)).toBeDefined()
    expect(screen.getByAltText('avatar')).toHaveAttribute('src', imageUrl)
  })

  it('Has correct styling when Avatar is provided', () => {
    const chipText = 'hello, I am a chip'
    const avatarTestId = 'avatar-chip-test'
    const imageUrl = 'https://i.imgur.com/UM3mrju.jpg'
    render(
      <Chip>
        <Avatar src={imageUrl} data-testid={avatarTestId} alt="avatar" />
        {chipText}
      </Chip>,
    )
    const chip = screen.getByText(chipText)
    const avatar = screen.queryByTestId(avatarTestId)
    expect(chip).toBeDefined()
    expect(chip).toHaveStyleRule('padding-left', '4px')
    expect(chip).toHaveStyleRule('padding-right', enabled.spacings.right)
    expect(chip).toHaveStyleRule(
      'border-radius',
      enabled.border.type === 'border' && enabled.border.radius,
    )
    expect(avatar).toBeDefined()
    expect(screen.getByAltText('avatar')).toHaveAttribute('src', imageUrl)
    expect(avatar).toHaveStyleRule('height', enabled.entities.icon.height)
    expect(avatar).toHaveStyleRule('width', enabled.entities.icon.width)
  })

  it('Has called handleDelete once with props when close icon is clicked', () => {
    const chipText = 'hello, I am a chip'
    const chipId = 'avatar-chip-test'
    let callbackId = ''
    const handleDelete = jest.fn((x: React.MouseEvent<HTMLElement>) => {
      // eslint-disable-next-line testing-library/no-node-access
      callbackId = (x.target as HTMLElement).parentElement.id
    })

    render(
      <Chip id={chipId} onDelete={handleDelete}>
        {chipText}
      </Chip>,
    )

    const closeIcon = screen.queryAllByTitle('close')[0]

    fireEvent.click(closeIcon)

    expect(handleDelete).toHaveBeenCalled()
    expect(callbackId).toEqual(chipId)
  })
  it('Has called handleClick once with props when clicked', () => {
    const chipText = 'hello, I am a chip'
    const chipId = 'avatar-chip-test'
    let callbackId = ''
    const handleClick = jest.fn((x: React.MouseEvent<HTMLElement>) => {
      callbackId = (x.target as HTMLElement).id
    })

    render(
      <Chip id={chipId} onClick={handleClick} data-testid="chip">
        {chipText}
      </Chip>,
    )

    fireEvent.click(screen.getByTestId('chip'))

    expect(handleClick).toHaveBeenCalled()
    expect(callbackId).toEqual(chipId)
  })
  it('Has called handleClick once with props when pressed Enter', () => {
    const chipText = 'hello, I am a chip'
    const chipId = 'avatar-chip-test'
    let callbackId = ''
    const handleClick = jest.fn((x: React.MouseEvent<HTMLElement>) => {
      callbackId = (x.target as HTMLElement).id
    })

    render(
      <Chip id={chipId} onClick={handleClick} data-testid="chip">
        {chipText}
      </Chip>,
    )

    fireEvent.click(screen.getByTestId('chip'), {
      key: 'Enter',
    })

    expect(handleClick).toHaveBeenCalled()
    expect(callbackId).toEqual(chipId)
  })
  it('Has correct active styling', () => {
    const chipText = 'hello, I am a chip'
    render(<Chip variant="active">{chipText}</Chip>)
    expect(screen.queryByText(chipText)).toHaveStyleRule(
      'background',
      enabled.states.active.background,
    )
  })
  it('Has some correct error styling', () => {
    const chipText = 'hello, I am a chip'
    const iconTestId = 'avatar-chip-test'

    render(
      <Chip variant="error">
        <Icon data={add} data-testid={iconTestId} />
        {chipText}
      </Chip>,
    )
    const chip = screen.queryByText(chipText)
    expect(chip).toHaveStyleRule('background', error.background)
    expect(chip).toHaveStyleRule('color', error.typography.color)
  })
})
