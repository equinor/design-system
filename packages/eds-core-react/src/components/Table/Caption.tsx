import { forwardRef, HTMLAttributes } from 'react'
import styled from 'styled-components'
import type { StyledObject } from 'styled-components'

const StyledCaption = styled.caption<CaptionProps>(
  ({ captionSide = 'top' }) => ({
    captionSide,
  }),
)
/* @Todo styled use CSSObject later */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CaptionProps = Pick<StyledObject<any>, 'captionSide'> &
  HTMLAttributes<HTMLTableCaptionElement>

export const Caption = forwardRef<HTMLTableCaptionElement, CaptionProps>(
  function Caption(props, ref) {
    return <StyledCaption {...props} ref={ref} />
  },
)
