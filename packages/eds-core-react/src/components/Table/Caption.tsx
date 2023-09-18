import { forwardRef, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import type { CSSObject } from 'styled-components'

type StyledCaptionProps = {
  $captionSide: string
}
const StyledCaption = styled.caption<StyledCaptionProps>(({ $captionSide }) => {
  return css`
    caption-side: ${$captionSide};
  `
})
export type CaptionProps = Pick<CSSObject, 'captionSide'> &
  HTMLAttributes<HTMLTableCaptionElement>

export const Caption = forwardRef<HTMLTableCaptionElement, CaptionProps>(
  function Caption({ captionSide = 'top', ...props }, ref) {
    return <StyledCaption $captionSide={captionSide} {...props} ref={ref} />
  },
)
