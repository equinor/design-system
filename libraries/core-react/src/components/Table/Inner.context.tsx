import * as React from 'react'

type State = {
  variant: 'body' | 'head'
}

const initalState: State = {
  variant: 'body',
}

export const InnerContext = React.createContext<State>(initalState)
