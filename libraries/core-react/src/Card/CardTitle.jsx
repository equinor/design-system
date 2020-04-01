import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Typography } from '../Typography'
import { Avatar } from '../Avatar'

import { card as tokens } from './Card.tokens'

const { spacings } = tokens

const StyledCardTitle = styled.div`
  /* grid-area: top; */
  padding-top: ${spacings.top};
  padding-bottom: ${spacings.bottom};
  display: flex;
  flex-direction: ${({ flexDirection }) => flexDirection};
  justify-content: space-between;
  align-items: center;
`

const StyledAvatarLeft = styled(Avatar)`
  margin-right: 16px;
  order: ${({ avatarOrder }) => avatarOrder};
`

const StyledAvatarRight = styled(Avatar)`
  order: ${({ avatarOrder }) => avatarOrder};
`

const ActionWrapper = styled.div`
  order: ${({ actionOrder }) => actionOrder};
`

const TextWrapper = styled.div`
  order: ${({ textOrder }) => textOrder};
  flex-grow: 2;
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
  // Default for h4 & h5 titles:
  let subtitleVariant = 'body_short'
  let avatarOrder = 3
  let actionOrder = 1
  let textOrder = 1
  const isVariantH6 = variant === 'h6'

  if (isVariantH6) {
    // Change CSS FlexBox variables to fit h6 design:
    subtitleVariant = overline ? 'overline' : 'caption'
    avatarOrder = 1
    textOrder = 2
    actionOrder = 3
  }

  const props = {
    ...rest,
    ref,
  }

  const textProps = {
    textOrder,
  }

  const avatarProps = {
    avatarOrder,
  }

  const actionProps = {
    actionOrder,
  }

  return (
    <StyledCardTitle {...props}>
      <TextWrapper {...textProps}>
        {overline && subtitle && isVariantH6 && (
          <Typography variant={subtitleVariant}>{subtitle}</Typography>
        )}
        <Typography variant={variant}>{title}</Typography>
        {((subtitle && !isVariantH6) || (isVariantH6 && !overline)) && (
          <Typography variant={subtitleVariant}>{subtitle}</Typography>
        )}
      </TextWrapper>
      {((action && !avatar && !isVariantH6) || (action && isVariantH6)) && (
        <ActionWrapper {...actionProps}>{action}</ActionWrapper>
      )}
      {!isVariantH6 && avatar ? (
        <StyledAvatarRight
          {...avatarProps}
          alt={`Avatar for ${title}`}
          src={avatar}
          size={40}
        />
      ) : (
        isVariantH6 &&
        avatar && (
          <StyledAvatarLeft
            {...avatarProps}
            alt={`Avatar for ${title}`}
            src={avatar}
            size={40}
          />
        )
      )}

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
  // The Avatar for the Card Header
  avatar: PropTypes.string,
  // Metadata (tags, badges, free text): TODO: Confusion of design here
  // meta: PropTypes.node,
  // The action to display in the card header.
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
