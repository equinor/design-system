import { forwardRef, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { Divider } from '../Divider'
import { typographyTemplate } from '@equinor/eds-utils'

const StyledDialogContent = styled.div<DialogContentProps>(
  ({ theme, scrollable }) => {
    return css`
      ${typographyTemplate(theme.entities.content.typography)}
      min-height: ${theme.entities.content.minHeight};
      align-self: stretch;
      justify-self: stretch;
      padding: 0 ${theme.entities.children.spacings.right} 0
        ${theme.entities.children.spacings.left};
      &:first-child {
        padding-top: ${theme.entities.children.spacings.top};
      }
      &:last-child {
        padding-bottom: ${theme.entities.children.spacings.bottom};
      }
      ${scrollable &&
      css`
        min-height: initial;
        height: ${theme.entities.content.height};
        overflow-y: auto;
      `}
    `
  },
)

const StyledDivider = styled(Divider)`
  width: 100%;
  margin-bottom: 0;
`

export type DialogContentProps = {
  /** Control if the content should be scrollable */
  scrollable?: boolean
} & HTMLAttributes<HTMLDivElement>

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  function DialogContent({ children, scrollable = false, ...rest }, ref) {
    const props = {
      scrollable,
      ref,
      ...rest,
    }
    return (
      <>
        <StyledDialogContent id="eds-dialog-customcontent" {...props}>
          {children}
        </StyledDialogContent>

        {children && scrollable && (
          <StyledDivider color="medium" variant="small" />
        )}
      </>
    )
  },
)
