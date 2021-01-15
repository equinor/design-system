import * as React from 'react'

type State = {
  variant: 'body' | 'head'
  sticky?: boolean
}

const initalState: State = {
  variant: 'body',
}

export const InnerContext = React.createContext<State>(initalState)
