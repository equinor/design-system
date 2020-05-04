import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { clear } from '@equinor/eds-icons'
import { spacingsTemplate } from '../_common/templates'
import { Typography } from '../Typography'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { sidesheet as tokens } from './SideSheet.tokens'

const icons = {
  clear,
}

Icon.add(icons)

const { background, spacings, border } = tokens

const StyledSideSheet = styled.div`
  height: 100%;
  position: absolute;
  z-index: 1;
  top: 0;
  right: 0;
  box-sizing: border-box;
  border-left: ${border.left.width} solid ${border.left.color};
  background: ${background};
  width: ${({ width }) => width};

  ${spacingsTemplate(spacings)};
`

const Header = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 24px;
  padding-right: 10px;
`

/**
 * @typedef Props
 * @prop {string} [title] Title for Side Sheet
 * @prop {'small' | 'medium' | 'large' | 'xlarge'} [variant] Variant controls width of Side Sheet
 * @prop {React.MouseEventHandler<HTMLButtonElement>} [onClose] OnClick function (close)
 * @prop {boolean} [open] Open / close Side Sheet
 */

export const SideSheet = forwardRef(
  /**
   * @param {Props & React.HTMLAttributes<HTMLDivElement>} props
   * @param ref
   */
  function EdsSideSheet(
    { variant, title, children, className, open, onClose, ...rest },
    ref,
  ) {
    const props = {
      ...rest,
      className,
      ref,
      width: tokens.width[variant],
    }

    // Controller must set open={false} when pressing the close button
    return (
      open && (
        <StyledSideSheet {...props} id="side-sheet">
          <Header>
            <Typography variant="h2">{title}</Typography>
            <Button variant="ghost_icon" onClick={onClose}>
              <Icon name="clear" title="Close" />
            </Button>
          </Header>
          {children}
        </StyledSideSheet>
      )
    )
  },
)

SideSheet.displayName = 'eds-sidesheet'

SideSheet.propTypes = {
  // Title for Side Sheet
  title: PropTypes.string,
  // Variant controls width of Side Sheet
  // @ts-ignore
  variant: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  // OnClick function (close)
  onClose: PropTypes.func,
  // Open / close Side Sheet:
  open: PropTypes.bool,
  // Any type of content
  /** @ignore */
  children: PropTypes.node,
  /** @ignore */
  className: PropTypes.string,
}

SideSheet.defaultProps = {
  // @ts-ignore
  variant: 'medium',
  title: '',
  className: '',
  open: true,
  onClose: undefined,
  children: undefined,
}
