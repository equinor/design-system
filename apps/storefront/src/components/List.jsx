import React from 'react'
import PropTypes from 'prop-types'
import { List } from '@equinor/eds-core-react/dist/core-react.cjs.js'
import styled from 'styled-components'

const { ListItem: ListItemEds } = List

export const UnorderedList = ({ children }) => {
  return <List variant="bullet">{children}</List>
}

UnorderedList.propTypes = {
  children: PropTypes.node.isRequired,
}

export const OrderedList = ({ children }) => {
  return <List variant="numbered">{children}</List>
}

OrderedList.propTypes = {
  children: PropTypes.node.isRequired,
}

const StyledListItem = styled(ListItemEds)`
  line-height: 24px;
`

export const ListItem = ({ children }) => {
  return <StyledListItem>{children}</StyledListItem>
}

ListItem.propTypes = {
  children: PropTypes.node.isRequired,
}
