import { createContext } from 'react'

type State = {
  variant: 'body' | 'head' | 'foot'
  sticky?: boolean
}

const initialState: State = {
  variant: 'body',
}

export const InnerContext = createContext<State>(initialState)
