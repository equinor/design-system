import { forwardRef, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { Divider } from '../Divider'

export type DialogHeaderProps = HTMLAttributes<HTMLDivElement>

const StyledDialogHeader = styled.div(({ theme }) => {
  return css`
    display: flex;
    justify-content: space-betweene;
    algin-items: center;
    padding: ${theme.entities.children.spacings.top}
      ${theme.entities.children.spacings.right} 0
      ${theme.entities.children.spacings.left};
  `
})

const StyledDivider = styled(Divider)(({ theme }) => {
  return css`
    margin-bottom: ${theme.entities.divider.spacings.bottom};
  `
})

export const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(
  function DialogHeader({ children, ...rest }, ref) {
    const props = {
      ...rest,
      ref,
    }

    return (
      <div {...props}>
        <StyledDialogHeader>{children}</StyledDialogHeader>
        <StyledDivider variant="small" color="medium" />
      </div>
    )
  },
)
