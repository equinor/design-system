import { forwardRef, HTMLAttributes } from 'react'
import styled from 'styled-components'
import { clear } from '@equinor/eds-icons'
import { spacingsTemplate, bordersTemplate } from '../../utils'
import { Typography } from '../Typography'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { comfortable as tokens, variants } from './SideSheet.tokens'

const { background, spacings, border } = tokens

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
  open?: boolean
} & HTMLAttributes<HTMLDivElement>

const StyledSideSheet = styled.div<StyleProps>`
  height: 100%;
  position: absolute;
  z-index: 200;
  top: 0;
  right: 0;
  box-sizing: border-box;
  background: ${background};
  width: ${({ width }) => width};

  ${bordersTemplate(border)}
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

export const SideSheet = forwardRef<HTMLDivElement, SideSheetProps>(
  function SideSheet(
    {
      variant = 'medium',
      title = '',
      children,
      className = '',
      open = true,
      onClose,
      ...rest
    },
    ref,
  ) {
    const props = {
      ...rest,
      className,
      ref,
      width: variants[variant],
    }

    // Controller must set open={false} when pressing the close button
    return (
      open && (
        <StyledSideSheet {...props} id="side-sheet">
          <Header>
            <Typography variant="h2">{title}</Typography>
            <Button variant="ghost_icon" onClick={onClose} title="Close">
              <Icon name="clear" title="Close" data={clear} />
            </Button>
          </Header>
          {children}
        </StyledSideSheet>
      )
    )
  },
)

// SideSheet.displayName = 'eds-sidesheet'
