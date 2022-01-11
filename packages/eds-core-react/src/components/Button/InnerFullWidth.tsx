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
    margin-top: -4px;
    margin-bottom: -4px;
  }

  > :is(svg, img):first-child {
    margin-right: 0.5714em; //8px
  }

  > :is(svg, img):last-child {
    margin-left: 0.5714em; // 80px
  }

  > :is(svg, img):only-child {
    margin-left: auto;
    margin-right: auto;
  }

  > span:first-child {
    margin-left: 2.2857em; // 32px
  }

  > span:last-child {
    margin-right: 2.2857em; // 32px
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
