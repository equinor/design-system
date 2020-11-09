/* eslint-disable no-undef */
import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { add } from '@equinor/eds-icons'
import { Banner } from '.'
import { Icon } from '../Icon'
import { banner as tokens } from './Banner.tokens'

const { BannerMessage, BannerIcon, BannerActions } = Banner
Icon.add({ add })

const StyledBanner = styled(Banner)`
  position: relative;
`

const { enabled } = tokens

const rgbaTrim = (x: string) => x.split(' ').join('')

afterEach(cleanup)

describe('Banner', () => {
  it('Can extend the css for the component', () => {
    const { container } = render(
      <StyledBanner>
        <BannerMessage>styled banner</BannerMessage>
      </StyledBanner>,
    )
    expect(container.firstChild).toHaveStyleRule('position', 'relative')
  })
  it('Has provided Message', () => {
    const bannerText = 'Banner test message'
    const { queryByText } = render(
      <Banner>
        <BannerMessage>{bannerText}</BannerMessage>
      </Banner>,
    )
    expect(queryByText(bannerText)).toBeDefined()
  })
  it('Has provided Icon', () => {
    const bannerText = 'Banner test'
    const iconTestId = 'banner-icon-test'
    const { queryByText, queryByTestId } = render(
      <Banner>
        <BannerIcon>
          <Icon name="add" data-testid={iconTestId} />
        </BannerIcon>
        <BannerMessage>{bannerText}</BannerMessage>
      </Banner>,
    )
    expect(queryByText(bannerText)).toBeDefined()
    expect(queryByTestId(iconTestId)).toBeDefined()
  })
  it('Has provided Actions', () => {
    const bannerText = 'Banner test'
    const actionButtonText = 'Banner action button text'
    const { queryByText } = render(
      <Banner>
        <BannerMessage>{bannerText}</BannerMessage>
        <BannerActions>
          <button type="button">{actionButtonText}</button>
        </BannerActions>
      </Banner>,
    )
    expect(queryByText(bannerText)).toBeDefined()
    expect(queryByText(actionButtonText)).toBeDefined()
  })

  it('Has correct default icon styling as info color', () => {
    const bannerText = 'Banner test'
    const iconWrapperTestId = 'banner-icon-wrapper-test'
    const { queryByTestId, container } = render(
      <Banner>
        <BannerIcon data-testid={iconWrapperTestId}>
          <Icon name="add" />
        </BannerIcon>
        <BannerMessage>{bannerText}</BannerMessage>
      </Banner>,
    )
    const iconSvg = container.querySelector('svg')
    expect(queryByTestId(iconWrapperTestId)).toHaveStyleRule(
      'background-color',
      rgbaTrim(enabled.icon.info.background),
    )
    expect(iconSvg).toHaveAttribute('fill', enabled.icon.info.color)
  })
  it('Has correct warning icon styling', () => {
    const bannerText = 'Banner test'
    const iconWrapperTestId = 'banner-icon-wrapper-test'
    const { queryByTestId, container } = render(
      <Banner>
        <BannerIcon variant="warning" data-testid={iconWrapperTestId}>
          <Icon name="add" />
        </BannerIcon>
        <BannerMessage>{bannerText}</BannerMessage>
      </Banner>,
    )
    const iconSvg = container.querySelector('svg')
    expect(queryByTestId(iconWrapperTestId)).toHaveStyleRule(
      'background-color',
      rgbaTrim(enabled.icon.warning.background),
    )
    expect(iconSvg).toHaveAttribute('fill', enabled.icon.warning.color)
  })
})
