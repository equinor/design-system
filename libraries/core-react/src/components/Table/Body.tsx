import * as React from 'react'
import { HTMLAttributes } from 'react'
import styled from 'styled-components'
import { InnerContext } from './Inner.context'

const TableBase = styled.tbody``

export type BodyProps = HTMLAttributes<HTMLTableSectionElement>

export const Body = ({ children, ...props }: BodyProps): JSX.Element => {
  return (
    <InnerContext.Provider value={{ variant: 'body' }}>
      <TableBase {...props}>{children}</TableBase>
    </InnerContext.Provider>
  )
}

// Body.displayName = 'eds-table-body'
