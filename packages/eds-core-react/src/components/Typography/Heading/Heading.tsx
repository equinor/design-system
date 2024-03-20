// eslint-disable-next-line import/no-named-as-default
import styled, { css } from 'styled-components'
import { forwardRef } from 'react'
import { HeadingInlineDocumentation } from './HeadingInlineDocumentation'
import { metrics } from '../metrics'
import { BaselineGrid } from './BaselineGrid'
import {
  calculateLineHeight,
  formatTextBoxTrimValues,
  getTextBoxTrimValues,
} from './typography.utils'
import { HeadingLevel, TypographySize } from './heading.types'
import { tokens } from '@equinor/eds-tokens'
import { headingTokens } from './heading.tokens'

export type StyleHeadingProps = {
  $fontFamily: string
  $fontSize: string
  $lineHeight: string
  $color: string
  $trimValues: {
    capHeightTrim: string
    baselineTrim: string
  }
}

const StyledHeading = styled.h1<StyleHeadingProps>`
  font-weight: 400;
  margin: 0;
  ${({ $fontFamily, $fontSize, $lineHeight, $color, $trimValues }) => css`
    font-family: ${$fontFamily};
    font-size: ${$fontSize};
    line-height: ${$lineHeight};
    color: ${$color};

    &::before {
      content: '';
      margin-bottom: ${$trimValues.capHeightTrim};
      display: table;
    }

    &::after {
      content: '';
      margin-top: ${$trimValues.baselineTrim};
      display: table;
    }
  `}
`

export type HeadingProps = {
  size?: TypographySize
  as?: HeadingLevel
  children?: React.ReactNode
  isDocumentationVisible?: boolean
  isGridVisible?: boolean
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  function Heading(props, ref) {
    const size = props.size || 'BASE'
    const level: HeadingLevel = props.as ?? 'h1'

    const currentHeadingToken = headingTokens[size]
    const lineHeight = calculateLineHeight({
      fontSize: currentHeadingToken.fontSize,
      lineHeightMultiplier: currentHeadingToken.lineHeightMultiplier,
    })
    const color = tokens.typography.heading?.[level]?.color ?? '#000'

    const textBoxTrimValues = getTextBoxTrimValues({
      fontSize: currentHeadingToken.fontSize,
      lineHeight,
      fontMetrics: metrics[currentHeadingToken.fontAlias],
    })

    const formattedTrimValues = formatTextBoxTrimValues({
      fontSize: currentHeadingToken.fontSize,
      capHeightTrim: textBoxTrimValues.capHeightTrim,
      baselineTrim: textBoxTrimValues.baselineTrim,
      baselineTrimGrid: textBoxTrimValues.baselineTrimGrid,
    })

    const trimValuesWithUnit = {
      capHeightTrim: `${formattedTrimValues.capHeightTrim}em`,
      baselineTrim: `${formattedTrimValues.baselineTrimGrid}em`,
    }

    const heading = (
      <StyledHeading
        ref={ref}
        as={level}
        $fontSize={`${currentHeadingToken.fontSize}px`}
        $lineHeight={`${lineHeight}px`}
        $fontFamily={currentHeadingToken.fontFamily}
        $color={color}
        $trimValues={trimValuesWithUnit}
      >
        {props.children}
        {props.isDocumentationVisible && (
          <>
            <HeadingInlineDocumentation
              size={size}
              $fontSize={`${currentHeadingToken.fontSize}px`}
              $lineHeight={`${lineHeight}px`}
              $fontFamily={currentHeadingToken.fontFamily}
              $color={color}
              $trimValues={trimValuesWithUnit}
              level={level}
            />
          </>
        )}
      </StyledHeading>
    )

    if (props.isGridVisible) return <BaselineGrid>{heading}</BaselineGrid>

    return heading
  },
)
