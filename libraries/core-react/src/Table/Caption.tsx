import React, { forwardRef, HTMLAttributes } from 'react'
import styled from 'styled-components'
import type { CSSObject } from 'styled-components'

const StyledCaption = styled.caption<CaptionProps>(
  ({ captionSide = 'top' }) => ({
    captionSide,
  }),
)

type CaptionProps = Pick<CSSObject, 'captionSide'> &
  HTMLAttributes<HTMLTableCaptionElement>

export const Caption = forwardRef<HTMLTableCaptionElement, CaptionProps>(
  function Caption(props, ref) {
    return <StyledCaption {...props} ref={ref} />
  },
)
