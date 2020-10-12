import React, { FunctionComponent } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const TableBase = styled.table`
  border-spacing: 0;
  border-collapse: collapse;
`

type Props = React.HTMLAttributes<HTMLTableElement>

export const Table: FunctionComponent<Props> = (props: Props) => {
  const { children } = props
  return <TableBase {...props}>{children}</TableBase>
}

Table.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node.isRequired,
}

Table.defaultProps = {
  className: '',
}

Table.displayName = 'eds-table'
