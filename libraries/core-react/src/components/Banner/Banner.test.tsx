/* eslint-disable no-undef */
import { render, cleanup, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { add } from '@equinor/eds-icons'
import { Banner } from '.'
import { Icon } from '../Icon'
import * as tokens from './Banner.tokens'

Icon.add({ add })

const { info, warning } = tokens

const StyledBanner = styled(Banner)`
  position: relative;
`

const rgbaTrim = (x: string) => x.split(' ').join('')

afterEach(cleanup)

describe('Banner', () => {
  it('Matches snapshot', () => {
    const { asFragment } = render(
      <Banner>
        <Banner.Icon>
          <Icon data={add} />
        </Banner.Icon>
        <Banner.Message>Banner message</Banner.Message>
      </Banner>,
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('Can extend the css for the component', () => {
    render(
      <StyledBanner>
        <Banner.Message>styled banner</Banner.Message>
      </StyledBanner>,
    )
    expect(screen.getByRole('alert')).toHaveStyleRule('position', 'relative')
  })
  it('Has provided Message', () => {
    const bannerText = 'Banner test message'
    render(
      <Banner>
        <Banner.Message>{bannerText}</Banner.Message>
      </Banner>,
    )
    expect(screen.queryByText(bannerText)).toBeDefined()
  })
  it('Has provided Icon', () => {
    const bannerText = 'Banner test'
    const iconTestId = 'banner-icon-test'
    render(
      <Banner>
        <Banner.Icon>
          <Icon name="add" data-testid={iconTestId} />
        </Banner.Icon>
        <Banner.Message>{bannerText}</Banner.Message>
      </Banner>,
    )
    expect(screen.queryByText(bannerText)).toBeDefined()
    expect(screen.queryByTestId(iconTestId)).toBeDefined()
  })
  it('Has provided Actions', () => {
    const bannerText = 'Banner test'
    const actionButtonText = 'Banner action button text'
    render(
      <Banner>
        <Banner.Message>{bannerText}</Banner.Message>
        <Banner.Actions>
          <button type="button">{actionButtonText}</button>
        </Banner.Actions>
      </Banner>,
    )
    expect(screen.queryByText(bannerText)).toBeDefined()
    expect(screen.queryByText(actionButtonText)).toBeDefined()
  })

  it('Has correct default icon styling as info color', () => {
    const bannerText = 'Banner test'
    const iconWrapperTestId = 'banner-icon-wrapper-test'
    render(
      <Banner>
        <Banner.Icon data-testid={iconWrapperTestId}>
          <Icon name="add" data-testid="icon" />
        </Banner.Icon>
        <Banner.Message>{bannerText}</Banner.Message>
      </Banner>,
    )
    const iconSvg = screen.getByTestId('icon')
    expect(screen.queryByTestId(iconWrapperTestId)).toHaveStyleRule(
      'background-color',
      rgbaTrim(info.entities.icon.background),
    )
    expect(iconSvg).toHaveAttribute('fill', info.entities.icon.typography.color)
  })
  it('Has correct warning icon styling', () => {
    const bannerText = 'Banner test'
    const iconWrapperTestId = 'banner-icon-wrapper-test'
    render(
      <Banner>
        <Banner.Icon variant="warning" data-testid={iconWrapperTestId}>
          <Icon name="add" data-testid="icon" />
        </Banner.Icon>
        <Banner.Message>{bannerText}</Banner.Message>
      </Banner>,
    )
    const iconSvg = screen.getByTestId('icon')

    expect(screen.queryByTestId(iconWrapperTestId)).toHaveStyleRule(
      'background-color',
      rgbaTrim(warning.entities.icon.background),
    )
    expect(iconSvg).toHaveAttribute(
      'fill',
      warning.entities.icon.typography.color,
    )
  })
})
