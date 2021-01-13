import * as React from 'react'
import { HTMLAttributes, forwardRef } from 'react'
import styled from 'styled-components'
import { InnerContext } from './Inner.context'

const TableBase = styled.tbody``

export type BodyProps = HTMLAttributes<HTMLTableSectionElement>

export const Body = forwardRef<HTMLTableSectionElement, BodyProps>(
  function Body({ children, ...props }, ref) {
    return (
      <InnerContext.Provider value={{ variant: 'body' }}>
        <TableBase {...props} ref={ref}>
          {children}
        </TableBase>
      </InnerContext.Provider>
    )
  },
)
