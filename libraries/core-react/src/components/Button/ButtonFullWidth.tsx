import { forwardRef, Children as ReactChildren, HTMLAttributes } from 'react'
import styled from 'styled-components'

const ButtonCenterContent = styled.span`
  text-align: center;
  flex: 1;
`

const ButtonInner = styled.span`
  height: 100%;
  display: flex;
  align-items: center;

  > img:first-child,
  > svg:first-child {
    margin-right: 8px;
  }

  > img:last-child,
  > svg:last-child {
    margin-left: 8px;
  }

  > img:only-child,
  > svg:only-child {
    margin-left: auto;
    margin-right: auto;
  }

  > span:first-child {
    margin-left: 32px;
  }

  > span:last-child {
    margin-right: 32px;
  }

  > span:only-child {
    margin-right: 0;
    margin-left: 0;
  }
`

export const ButtonFullWidth = forwardRef<
  HTMLSpanElement,
  HTMLAttributes<HTMLSpanElement>
>(function ButtonFullWidth({ children, ...other }, ref) {
  // We need everything in elements for proper flexing 💪
  const updatedChildren = ReactChildren.map(children, (child) =>
    typeof child !== 'object' ? (
      <ButtonCenterContent>{child}</ButtonCenterContent>
    ) : (
      child
    ),
  )

  return <ButtonInner>{updatedChildren}</ButtonInner>
})
