import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Typography } from '../Typography'
import { Avatar } from '../Avatar'

import { card as tokens } from './Card.tokens'

const { spacings } = tokens

const StyledCardTitle = styled.div`
  grid-area: top;
  padding-top: ${spacings.top};
  padding-bottom: ${spacings.bottom};
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
  const props = {
    ...rest,
    ref,
  }

  const subtitleVariant =
    // eslint-disable-next-line no-nested-ternary
    variant === 'h6' && overline
      ? 'overline'
      : variant === 'h6' && !overline
      ? 'caption'
      : 'body_short'

  return (
    <StyledCardTitle {...props}>
      {overline && <Typography variant="overline">{overline}</Typography>}
      <Typography variant={variant}>{title}</Typography>
      {avatar && <Avatar alt={`Avatar for ${title}`} src={avatar} size={40} />}
      {subtitle && (
        <Typography variant={subtitleVariant}>{subtitle}</Typography>
      )}
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
