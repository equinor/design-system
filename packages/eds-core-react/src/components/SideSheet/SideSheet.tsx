import { forwardRef, HTMLAttributes } from 'react'
import styled from 'styled-components'
import { clear } from '@equinor/eds-icons'
import {
  spacingsTemplate,
  bordersTemplate,
  typographyTemplate,
} from '@equinor/eds-utils'
import { Typography } from '../Typography'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { comfortable as tokens, variants } from './SideSheet.tokens'

const { background, spacings, typography, borderLeft, borderRight } = tokens
type StyleProps = {
  width: string
  position?: 'left' | 'right'
}

export type SideSheetProps = {
  /** Title for Side Sheet */
  title?: string
  /** Variant controls width of Side Sheet */
  variant?: 'small' | 'medium' | 'large' | 'xlarge'
  /** OnClick function (close) */
  onClose?: (Event) => void
  /** Open / close Side Sheet */
  open: boolean
  /** Override width of Side Sheet */
  width?: string
  /** Controls if the sidesheet should open on the right or left */
  position?: 'left' | 'right'
} & HTMLAttributes<HTMLDivElement>

const StyledSideSheet = styled.div<StyleProps>`
  height: 100%;
  position: absolute;
  z-index: 1200;
  top: 0;
  ${({ position }) => `${position}: 0`};
  box-sizing: border-box;
  background: ${background};
  width: ${({ width }) => width};
  ${({ position }) =>
    bordersTemplate(position === 'left' ? borderRight : borderLeft)}
  ${spacingsTemplate(spacings)};
  ${typographyTemplate(typography)}
`

const Header = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 24px;
  padding-right: 10px;
  & > button {
    margin-left: auto;
  }
`

export const SideSheet = forwardRef<HTMLDivElement, SideSheetProps>(
  function SideSheet(
    {
      variant = 'medium',
      position = 'right',
      width,
      title,
      children,
      open,
      onClose,
      ...rest
    },
    ref,
  ) {
    const props = {
      ...rest,
      ref,
      width: width || variants[variant],
      position,
    }

    return (
      open && (
        <StyledSideSheet {...props}>
          {(title || onClose) && (
            <Header>
              {title && <Typography variant="h2">{title}</Typography>}
              {onClose && (
                <Button
                  variant="ghost_icon"
                  onClick={onClose}
                  title="Close"
                  aria-label="Close sidesheet"
                >
                  <Icon name="clear" data={clear} />
                </Button>
              )}
            </Header>
          )}
          {children}
        </StyledSideSheet>
      )
    )
  },
)
