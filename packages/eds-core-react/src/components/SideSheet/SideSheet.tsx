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

const { background, spacings, border, typography } = tokens

type StyleProps = {
  width: string
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
} & HTMLAttributes<HTMLDivElement>

const StyledSideSheet = styled.div<StyleProps>`
  height: 100%;
  position: absolute;
  z-index: 1200;
  top: 0;
  right: 0;
  box-sizing: border-box;
  background: ${background};
  width: ${({ width }) => width};

  ${bordersTemplate(border)}
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
    flex-shrink: 0;
  }
`

export const SideSheet = forwardRef<HTMLDivElement, SideSheetProps>(
  function SideSheet(
    { variant = 'medium', width, title, children, open, onClose, ...rest },
    ref,
  ) {
    const props = {
      ...rest,
      ref,
      width: width || variants[variant],
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
