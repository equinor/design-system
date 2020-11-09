import { HTMLAttributes } from 'react'
import styled from 'styled-components'

const TableBase = styled.tbody``

type Props = HTMLAttributes<HTMLTableSectionElement>

export const Body = ({ children, ...props }: Props): JSX.Element => {
  return <TableBase {...props}>{children}</TableBase>
}

// Body.displayName = 'eds-table-body'
