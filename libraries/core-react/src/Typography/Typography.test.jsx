/* eslint-disable no-undef */
import React from 'react'
import { render, cleanup, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { Typography } from '.'
import { tokens } from '@equinor/eds-tokens'

const StyledTypography = styled(Typography)`
  margin-top: 16px;
  margin-bottom: 32px;
`
const stripSpaces = (t) => t.replace(/\s/g, '')

const expectToMatchTypography = (element, token) => {
  const {
    color,
    fontFamily,
    fontSize,
    fontWeight,
    lineHeight,
    fontStyle,
  } = token
  expect(element).toHaveStyleRule('color', stripSpaces(color))
  expect(element).toHaveStyleRule('font-family', fontFamily)
  expect(element).toHaveStyleRule('font-size', fontSize)
  expect(element).toHaveStyleRule('font-weight', fontWeight.toString())
  expect(element).toHaveStyleRule('line-height', lineHeight)
  expect(element).toHaveStyleRule('font-style', fontStyle)
}

afterEach(cleanup)

describe('Typography', () => {
  it('throws error when variant is wrong', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      render(<Typography variant="label">Test</Typography>)
    }).toThrowError()

    jest.clearAllMocks()
  })
  it('has correct styling when variant is provided with weight', () => {
    render(
      <Typography variant="body_short" fontWeight="medium">
        Test
      </Typography>,
    )

    const typography = screen.getByText('Test')
    const token = tokens.typography.paragraph.body_short

    expect(typography.nodeName).toBe('P')
    expectToMatchTypography(typography, { ...token, fontWeight: 'medium' })
  })
  it('has correct styling when variant is provided', () => {
    render(<Typography variant="body_short">Test</Typography>)

    const typography = screen.getByText('Test')
    const token = tokens.typography.paragraph.body_short

    expect(typography.nodeName).toBe('P')
    expectToMatchTypography(typography, token)
  })
  it('has correct styling when variant & group is provided', () => {
    render(
      <Typography group="navigation" variant="menu_title" as="span">
        Test
      </Typography>,
    )

    const typography = screen.getByText('Test')
    const token = tokens.typography.navigation.menu_title

    expect(typography.nodeName).toBe('SPAN')
    expectToMatchTypography(typography, token)
  })
  it('has correct styling when variant is provided with bold & italic', () => {
    render(
      <Typography variant="body_short" bold italic>
        Test
      </Typography>,
    )

    const typography = screen.getByText('Test')
    const token = tokens.typography.paragraph.body_short_bold_italic

    expect(typography.nodeName).toBe('P')
    expectToMatchTypography(typography, token)
  })
  it('has correct element type & styling when link is set', () => {
    render(
      <Typography variant="body_short" link>
        Test
      </Typography>,
    )

    const typography = screen.getByText('Test')
    const token = tokens.typography.paragraph.body_short_link

    expect(typography.nodeName).toBe('A')
    expectToMatchTypography(typography, token)
  })
  it('has correct element type when using "as" prop', () => {
    render(
      <Typography variant="h2" as="h4">
        Test
      </Typography>,
    )

    const typography = screen.getByText('Test')
    const token = tokens.typography.heading.h2
    expect(typography.nodeName).toBe('H4')
    expectToMatchTypography(typography, token)
  })
  it('can extend the css for the component', () => {
    render(<StyledTypography>Test</StyledTypography>)

    const typography = screen.getByText('Test')

    expect(typography).toHaveStyleRule('margin-top', '16px')
    expect(typography).toHaveStyleRule('margin-bottom', '32px')
  })
})
