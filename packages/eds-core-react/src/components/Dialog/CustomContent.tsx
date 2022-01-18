import { forwardRef, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { Divider } from '../Divider'
import { typographyTemplate } from '../../utils'

const StyledCustomContent = styled.div<DialogCustomContentProps>(
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
        padding-bottom: ${theme.entities.content.spacings.bottom};
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

export type DialogCustomContentProps = {
  /** Control if the content should be scrollable */
  scrollable?: boolean
} & HTMLAttributes<HTMLDivElement>

export const CustomContent = forwardRef<
  HTMLDivElement,
  DialogCustomContentProps
>(function CustomContent({ children, scrollable = false, ...rest }, ref) {
  const props = {
    scrollable,
    ref,
    ...rest,
  }
  return (
    <>
      <StyledCustomContent id="eds-dialog-customcontent" {...props}>
        {children}
      </StyledCustomContent>

      {children && scrollable && (
        <StyledDivider color="medium" variant="small" />
      )}
    </>
  )
})
