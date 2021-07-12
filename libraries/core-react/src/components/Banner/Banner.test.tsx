/* eslint-disable no-undef */
import { render, cleanup } from '@testing-library/react'
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
    const { container } = render(
      <StyledBanner>
        <Banner.Message>styled banner</Banner.Message>
      </StyledBanner>,
    )
    expect(container.firstChild).toHaveStyleRule('position', 'relative')
  })
  it('Has provided Message', () => {
    const bannerText = 'Banner test message'
    const { queryByText } = render(
      <Banner>
        <Banner.Message>{bannerText}</Banner.Message>
      </Banner>,
    )
    expect(queryByText(bannerText)).toBeDefined()
  })
  it('Has provided Icon', () => {
    const bannerText = 'Banner test'
    const iconTestId = 'banner-icon-test'
    const { queryByText, queryByTestId } = render(
      <Banner>
        <Banner.Icon>
          <Icon name="add" data-testid={iconTestId} />
        </Banner.Icon>
        <Banner.Message>{bannerText}</Banner.Message>
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
        <Banner.Message>{bannerText}</Banner.Message>
        <Banner.Actions>
          <button type="button">{actionButtonText}</button>
        </Banner.Actions>
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
        <Banner.Icon data-testid={iconWrapperTestId}>
          <Icon name="add" />
        </Banner.Icon>
        <Banner.Message>{bannerText}</Banner.Message>
      </Banner>,
    )
    const iconSvg = container.querySelector('svg')
    expect(queryByTestId(iconWrapperTestId)).toHaveStyleRule(
      'background-color',
      rgbaTrim(info.entities.icon.background),
    )
    expect(iconSvg).toHaveAttribute('fill', info.entities.icon.typography.color)
  })
  it('Has correct warning icon styling', () => {
    const bannerText = 'Banner test'
    const iconWrapperTestId = 'banner-icon-wrapper-test'
    const { queryByTestId, container } = render(
      <Banner>
        <Banner.Icon variant="warning" data-testid={iconWrapperTestId}>
          <Icon name="add" />
        </Banner.Icon>
        <Banner.Message>{bannerText}</Banner.Message>
      </Banner>,
    )
    const iconSvg = container.querySelector('svg')
    expect(queryByTestId(iconWrapperTestId)).toHaveStyleRule(
      'background-color',
      rgbaTrim(warning.entities.icon.background),
    )
    expect(iconSvg).toHaveAttribute(
      'fill',
      warning.entities.icon.typography.color,
    )
  })
})
