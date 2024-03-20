// eslint-disable-next-line import/no-named-as-default
import styled, { css } from 'styled-components'
import { forwardRef } from 'react'
import { HeadingInlineDocumentation } from './HeadingInlineDocumentation'
import { createStyleObject } from '@capsizecss/core'
import { metrics } from '../metrics'
import { BaselineGrid } from './BaselineGrid'
import { calculateLineHeight } from './typography.utils'
import { CapsizeStyles, HeadingLevel, TypographySize } from './heading.types'
import { tokens } from '@equinor/eds-tokens'
import { headingTokens } from './heading.tokens'

export type StyleHeadingProps = {
  $fontFamily: string
  $fontSize: string
  $lineHeight: string
  $color: string
  $capsizeStyles: CapsizeStyles
}

const StyledHeading = styled.h1<StyleHeadingProps>`
  font-weight: 400;
  margin: 0;
  ${({ $fontFamily, $fontSize, $lineHeight, $color, $capsizeStyles }) => css`
    font-family: ${$fontFamily};
    font-size: ${$fontSize};
    line-height: ${$lineHeight};
    color: ${$color};

    &::before {
      content: '';
      margin-bottom: ${$capsizeStyles['::before'].marginBottom};
      display: table;
    }

    &::after {
      content: '';
      margin-top: ${$capsizeStyles['::after'].marginTop};
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
    const capsizeStyles: CapsizeStyles = createStyleObject({
      fontSize: currentHeadingToken.fontSize,
      leading: lineHeight,
      fontMetrics: metrics[currentHeadingToken.fontAlias],
    })

    const heading = (
      <StyledHeading
        ref={ref}
        as={level}
        $fontSize={`${currentHeadingToken.fontSize}px`}
        $lineHeight={`${lineHeight}px`}
        $fontFamily={currentHeadingToken.fontFamily}
        $color={color}
        $capsizeStyles={capsizeStyles}
      >
        {props.isDocumentationVisible && (
          <HeadingInlineDocumentation
            size={size}
            $fontSize={`${currentHeadingToken.fontSize}px`}
            $lineHeight={`${lineHeight}px`}
            $fontFamily={currentHeadingToken.fontFamily}
            $color={color}
            $capsizeStyles={capsizeStyles}
            level={level}
          />
        )}
        {props.children}
      </StyledHeading>
    )

    if (props.isGridVisible) return <BaselineGrid>{heading}</BaselineGrid>

    return heading
  },
)
