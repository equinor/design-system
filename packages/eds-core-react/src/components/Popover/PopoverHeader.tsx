import { forwardRef, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { Divider } from '../Divider'

export type PopoverHeaderProps = HTMLAttributes<HTMLDivElement>

const StyledPopoverHeader = styled.div(({ theme }) => {
  return css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 ${theme.spacings.right} 0 ${theme.spacings.left};
  `
})

const StyledDivider = styled(Divider)`
  margin-bottom: 0;
`

export const PopoverHeader = forwardRef<HTMLDivElement, PopoverHeaderProps>(
  function PopoverHeader({ children, ...rest }, ref) {
    const props = {
      ...rest,
      ref,
    }

    return (
      <div {...props}>
        <StyledPopoverHeader>{children}</StyledPopoverHeader>
        <StyledDivider variant="small" />
      </div>
    )
  },
)
