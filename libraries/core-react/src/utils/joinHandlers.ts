import { FocusEvent } from 'react'

export const joinHandlers = (
  handler1: (e: FocusEvent<HTMLElement>) => void,
  handler2: (e: FocusEvent<HTMLElement>) => void,
) => {
  return (event: FocusEvent<HTMLElement>): void => {
    handler1 && handler1(event)
    handler2 && handler2(event)
  }
}
