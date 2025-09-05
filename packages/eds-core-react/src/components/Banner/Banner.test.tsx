/* eslint-disable no-undef */
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
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
  it('Should pass a11y test when only text', async () => {
    const { container } = render(
      <StyledBanner>
        <Banner.Message>Banner message</Banner.Message>
      </StyledBanner>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
  it('Should pass a11y test when text and icon', async () => {
    const { container } = render(
      <StyledBanner>
        <Banner.Icon>
          <Icon name="add" />
        </Banner.Icon>
        <Banner.Message>Banner message</Banner.Message>
      </StyledBanner>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
  it('Should pass a11y test when text and actions', async () => {
    const actionButtonText = 'Banner action button text'
    const { container } = render(
      <StyledBanner>
        <Banner.Message>Banner message</Banner.Message>
        <Banner.Actions>
          <button type="button">{actionButtonText}</button>
        </Banner.Actions>
      </StyledBanner>,
    )
    expect(await axe(container)).toHaveNoViolations()
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
    expect(screen.getByText(bannerText)).toBeDefined()
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
    expect(screen.getByText(bannerText)).toBeDefined()
    expect(screen.getByTestId(iconTestId)).toBeDefined()
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
    expect(screen.getByText(bannerText)).toBeDefined()
    expect(screen.getByText(actionButtonText)).toBeDefined()
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
      info.entities.icon.background,
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
      warning.entities.icon.background,
    )
    expect(iconSvg).toHaveAttribute(
      'fill',
      warning.entities.icon.typography.color,
    )
  })
})

describe('Banner with BannerContent', () => {
  it('Matches snapshot with BannerContent', () => {
    const { asFragment } = render(
      <Banner>
        <Banner.Icon>
          <Icon data={add} />
        </Banner.Icon>
        <Banner.Content>
          <div>
            <strong>Important update</strong>
            <p>Complex content with HTML elements</p>
          </div>
        </Banner.Content>
      </Banner>,
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('Should pass a11y test with BannerContent', async () => {
    const { container } = render(
      <StyledBanner>
        <Banner.Icon variant="warning">
          <Icon name="add" />
        </Banner.Icon>
        <Banner.Content>
          <div>
            <h3>Important update required</h3>
            <p>
              Your project contains{' '}
              <a href="#deprecated">3 deprecated components</a> that need to be
              updated.
            </p>
            <ul>
              <li>ComponentA</li>
              <li>ComponentB</li>
            </ul>
          </div>
        </Banner.Content>
        <Banner.Actions>
          <button type="button">View details</button>
        </Banner.Actions>
      </StyledBanner>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('Has provided Content with complex HTML', () => {
    const bannerHeading = 'Important Update'
    const bannerText = 'Your project needs attention'
    render(
      <Banner>
        <Banner.Content>
          <div>
            <h3>{bannerHeading}</h3>
            <p>{bannerText}</p>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
            </ul>
          </div>
        </Banner.Content>
      </Banner>,
    )
    expect(screen.getByText(bannerHeading)).toBeDefined()
    expect(screen.getByText(bannerText)).toBeDefined()
    expect(screen.getByRole('list')).toBeDefined()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('Has provided Content with Icon and Actions', () => {
    const bannerText = 'Complex banner content'
    const actionButtonText = 'Action button'
    const iconTestId = 'banner-icon-test'
    render(
      <Banner>
        <Banner.Icon>
          <Icon name="add" data-testid={iconTestId} />
        </Banner.Icon>
        <Banner.Content>
          <div>
            <strong>{bannerText}</strong>
            <p>Additional paragraph content</p>
          </div>
        </Banner.Content>
        <Banner.Actions>
          <button type="button">{actionButtonText}</button>
        </Banner.Actions>
      </Banner>,
    )
    expect(screen.getByText(bannerText)).toBeDefined()
    expect(screen.getByText('Additional paragraph content')).toBeDefined()
    expect(screen.getByText(actionButtonText)).toBeDefined()
    expect(screen.getByTestId(iconTestId)).toBeDefined()
  })

  it('BannerContent allows nested HTML without DOM nesting warnings', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <Banner>
        <Banner.Content>
          <div>
            <h4>Nested content test</h4>
            <p>
              This paragraph contains <a href="/link">a link</a> and{' '}
              <code>code elements</code>.
            </p>
            <ul>
              <li>
                List item with <strong>bold text</strong>
              </li>
            </ul>
          </div>
        </Banner.Content>
      </Banner>,
    )

    // Verify no validateDOMNesting warnings
    const domNestingErrors = consoleSpy.mock.calls.filter((call) => {
      return (
        call.length > 0 &&
        typeof call[0] === 'string' &&
        call[0].includes('validateDOMNesting')
      )
    })
    expect(domNestingErrors).toHaveLength(0)

    consoleSpy.mockRestore()
  })

  it('BannerContent vs BannerMessage - both work correctly', () => {
    render(
      <div>
        <Banner data-testid="simple-banner">
          <Banner.Message>Simple text message</Banner.Message>
        </Banner>

        <Banner data-testid="complex-banner">
          <Banner.Content>
            <div>
              <h3>Complex HTML content</h3>
              <p>With multiple elements</p>
            </div>
          </Banner.Content>
        </Banner>
      </div>,
    )

    expect(screen.getByText('Simple text message')).toBeDefined()
    expect(screen.getByText('Complex HTML content')).toBeDefined()
    expect(screen.getByText('With multiple elements')).toBeDefined()
  })
})
