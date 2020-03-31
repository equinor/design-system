import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { Typography } from '../Typography'
import { Avatar } from '../Avatar'

import { card as tokens } from './Card.tokens'

const { spacings } = tokens

const StyledCardTitle = styled.div`
  /* grid-area: top; */
  padding-top: ${spacings.top};
  padding-bottom: ${spacings.bottom};
  display: flex;
  flex-direction: ${({ direction }) => direction};
  justify-content: space-between;
  align-items: center;
`

const FlexWrapper = styled.div`
  order: ${({ order }) => order};
`

export const CardTitle = forwardRef(function EdsCardTitle(
  {
    children,
    title,
    variant,
    overline,
    subtitle,
    avatar,
    action,
    // meta,
    ...rest
  },
  ref,
) {
  let subtitleVariant = 'body_short' // Default for h4 & h5 titles
  let templateColumns = 'auto 40px' // Default avatar left side
  let templateRows = 'repeat(2, auto)'

  switch (variant) {
    case 'h6':
      if (overline) {
        subtitleVariant = 'overline'
      } else {
        subtitleVariant = 'caption'
      }
      break
    default:
      subtitleVariant = 'body_short'
      break
  }

  const props = {
    ...rest,
    ref,
    templateColumns,
    templateRows,
  }

  return (
    <StyledCardTitle {...props}>
      <FlexWrapper>
        {overline && subtitle && (
          <Typography variant="overline">{subtitle}</Typography>
        )}
        <Typography variant={variant}>{title}</Typography>
        {subtitle && !overline && (
          <Typography variant={subtitleVariant}>{subtitle}</Typography>
        )}
      </FlexWrapper>
      {avatar && <Avatar alt={`Avatar for ${title}`} src={avatar} size={40} />}
      {action && { action }}
      {children}
    </StyledCardTitle>
  )
})

CardTitle.displayName = 'eds-card-title'

CardTitle.propTypes = {
  // Title:
  title: PropTypes.string.isRequired,
  // Heading Type:
  variant: PropTypes.oneOf(['h4', 'h5', 'h6']),
  // Overline subtitle text for h6 variant (caption default):
  overline: PropTypes.bool,
  // Caption / Overline / Subtitle text:
  subtitle: PropTypes.string,
  // Avatar src, default size=40:
  avatar: PropTypes.string,
  // Metadata (tags, badges, free text): TODO: Confusion of design here
  // meta: PropTypes.node,
  // Action
  action: PropTypes.node,
  /** @ignore */
  children: PropTypes.node,
  /** @ignore */
  className: PropTypes.string,
}

CardTitle.defaultProps = {
  variant: 'h4',
  overline: false,
  subtitle: '',
  avatar: '',
  // meta: undefined,
  action: undefined,
  className: '',
  children: undefined,
}
