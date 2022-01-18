import { forwardRef } from 'react'
import styled, { css } from 'styled-components'
import { typographyTemplate } from '../../utils'

const StyledDialogTitle = styled.div(({ theme, children }) => {
  return css`
    ${typographyTemplate(theme.entities.title.typography)}
    min-height: ${theme.entities.title.minHeight};
    align-self: end;
    justify-self: start;
    margin-right: ${theme.entities.children.spacings.right};

    ${!children &&
    css`
      min-height: initial;
      height: '8px';
    `}
  `
})

export type DialogTitleProps = React.HTMLAttributes<HTMLDivElement>

export const DialogTitle = forwardRef<HTMLDivElement, DialogTitleProps>(
  function DialogTitle({ children, ...rest }, ref) {
    return (
      <>
        <StyledDialogTitle id="eds-dialog-title" ref={ref} {...rest}>
          {children}
        </StyledDialogTitle>
      </>
    )
  },
)
