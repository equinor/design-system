import { FunctionComponent } from 'react'
import * as React from 'react'
import styled from 'styled-components'

const TableBase = styled.tr``

type Props = React.HTMLAttributes<HTMLTableRowElement>

export const Row: FunctionComponent<Props> = (props) => {
  const { children } = props

  return <TableBase {...props}>{children}</TableBase>
}

// Row.displayName = 'EdsTableRow'
