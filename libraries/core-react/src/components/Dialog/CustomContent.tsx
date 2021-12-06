import { forwardRef, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { Divider } from '../Divider'
import { typographyTemplate, spacingsTemplate } from '../../utils'

const StyledCustomContent = styled.div<DialogCustomContentProps>(
  ({ theme, scrollable }) => {
    return css`
      ${typographyTemplate(theme.entities.content.typography)}
      min-height: ${theme.entities.content.minHeight};
      margin-bottom: ${theme.entities.content.spacings.bottom};
      align-self: stretch;
      justify-self: stretch;
      ${spacingsTemplate(theme.entities.children.spacings)}
      ${scrollable &&
      css`
        min-height: initial;
        height: ${theme.entities.content.height};
        overflow-y: auto;
      `}
    `
  },
)

const StyledDivider = styled(Divider)(({ theme }) => {
  return css`
    width: 100%;
    margin-bottom: ${theme.entities.divider.spacings.bottom};
  `
})

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
