import { forwardRef, Fragment, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { Divider } from '../Divider'
import { typographyTemplate, spacingsTemplate } from '../../utils'
import { dialog as tokens } from './Dialog.tokens'

const StyledCustomContent = styled.div<DialogCustomContentProps>`
  ${typographyTemplate(tokens.entities.content.typography)}
  min-height: ${tokens.entities.content.minHeight};
  margin-bottom: ${tokens.entities.content.spacings.bottom};
  align-self: stretch;
  justify-self: stretch;
  ${spacingsTemplate(tokens.entities.children.spacings)}

  ${({ scrollable }) =>
    scrollable &&
    css`
      min-height: initial;
      height: ${tokens.entities.content.height};
      overflow-y: auto;
    `}
`

const StyledDivider = styled(Divider)`
  width: 100%;
  margin-bottom: ${tokens.entities.divider.spacings.bottom};
`

export type DialogCustomContentProps = {
  /** Control if the content should be scrollable */
  scrollable?: boolean
} & HTMLAttributes<HTMLDivElement>

export const CustomContent = forwardRef<
  HTMLDivElement,
  DialogCustomContentProps
>(function CustomContent(
  { children, className = '', scrollable = false, ...rest },
  ref,
) {
  return (
    <Fragment>
      <StyledCustomContent
        className={className}
        scrollable={scrollable}
        id="eds-dialog-customcontent"
        ref={ref}
        {...rest}
      >
        {children}
      </StyledCustomContent>

      {children && scrollable && (
        <StyledDivider color="medium" variant="small" />
      )}
    </Fragment>
  )
})

// CustomContent.displayName = 'EdsDialogCustomcontent'
