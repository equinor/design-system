import { forwardRef, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import type { StyledObject } from 'styled-components'

type StyledCaptionProps = {
  $captionSide: string
}
const StyledCaption = styled.caption<StyledCaptionProps>(({ $captionSide }) => {
  return css`
    caption-side: ${$captionSide};
  `
})
/* @Todo styled use CSSObject later */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CaptionProps = Pick<StyledObject<any>, 'captionSide'> &
  HTMLAttributes<HTMLTableCaptionElement>

export const Caption = forwardRef<HTMLTableCaptionElement, CaptionProps>(
  function Caption({ captionSide = 'top', ...props }, ref) {
    return <StyledCaption $captionSide={captionSide} {...props} ref={ref} />
  },
)
