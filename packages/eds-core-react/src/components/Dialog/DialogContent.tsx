import { forwardRef, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { Divider } from '../Divider'
import { typographyTemplate } from '@equinor/eds-utils'

const StyledDialogContent = styled.div<{ $scrollable: boolean }>(
  ({ theme, $scrollable }) => {
    return css`
      --content-spacing-top: ${theme.entities.children.spacings.top};
      ${typographyTemplate(theme.entities.content.typography)}
      min-height: ${theme.entities.content.minHeight};
      align-self: stretch;
      justify-self: stretch;
      padding: 0 ${theme.entities.children.spacings.right} 0
        ${theme.entities.children.spacings.left};
      &:first-child {
        padding-top: var(--content-spacing-top);
      }
      &:last-child {
        padding-bottom: ${theme.entities.children.spacings.bottom};
      }

      ${$scrollable &&
      css`
        &:not(:first-child) {
          margin-top: calc(var(--content-spacing-top) * -1);
        }
        padding-top: var(--content-spacing-top);
        margin-bottom: calc(var(--content-spacing-top) * -1);
        padding-bottom: var(--content-spacing-top);
        min-height: initial;
        height: ${theme.entities.content.height};
        overflow-y: auto;
      `}
    `
  },
)

const StyledDivider = styled(Divider)`
  width: 100%;
  margin: 0;
`

export type DialogContentProps = {
  /** Control if the content should be scrollable */
  scrollable?: boolean
} & HTMLAttributes<HTMLDivElement>

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  function DialogContent({ children, scrollable = false, ...rest }, ref) {
    const props = {
      $scrollable: scrollable,
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
