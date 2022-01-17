import { forwardRef, Children as ReactChildren, HTMLAttributes } from 'react'
import styled from 'styled-components'

const FullWidthCenterContent = styled.span`
  text-align: center;
  flex: 1;
`

const FullWidthInner = styled.span`
  height: 100%;
  display: flex;
  align-items: center;

  > :is(svg, img) {
    margin-top: var(--eds_button__margin_y, inherit);
    margin-bottom: var(--eds_button__margin_y, inherit);
  }

  > :is(svg, img):first-child {
    margin-right: var(--eds_button__fullwidth__icon__margin_x, 8px);
  }

  > :is(svg, img):last-child {
    margin-left: var(--eds_button__fullwidth__icon__margin_x, 8px);
  }

  > :is(svg, img):only-child {
    margin-left: auto;
    margin-right: auto;
  }

  > span:first-child {
    background: orange;
    margin-left: var(--eds_button__fullwidth__margin_x, 32px);
  }

  > span:last-child {
    background: deeppink;
    margin-right: var(--eds_button__fullwidth__margin_x, 32px);
  }

  > span:only-child {
    margin-right: 0;
    margin-left: 0;
  }
`

export const InnerFullWidth = forwardRef<
  HTMLSpanElement,
  HTMLAttributes<HTMLSpanElement>
>(function InnerFullWidth({ children }, ref) {
  // We need everything in elements for proper flexing 💪
  const updatedChildren = ReactChildren.map(children, (child) =>
    typeof child !== 'object' ? (
      <FullWidthCenterContent>{child}</FullWidthCenterContent>
    ) : (
      child
    ),
  )

  return <FullWidthInner ref={ref}>{updatedChildren}</FullWidthInner>
})
