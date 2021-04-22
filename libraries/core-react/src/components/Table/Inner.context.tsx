import { createContext } from 'react'

type State = {
  variant: 'body' | 'head'
  sticky?: boolean
}

const initalState: State = {
  variant: 'body',
}

export const InnerContext = createContext<State>(initalState)
