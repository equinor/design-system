// @ts-nocheck
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { menu as tokens } from './Menu.tokens'
import { templates } from '../_common'
import { Divider } from '../Divider'
import { Typography } from '../Typography'

const { spacingsTemplate } = templates

const {
  enabled: {
    title: { spacings },
  },
} = tokens

const ListItem = styled.li.attrs(() => ({
  tabIndex: 0,
}))`
  ${spacingsTemplate(spacings)}
  &:focus {
    outline: none;
  }
`

export const MenuSection = React.memo(function EdsMenuSection(props) {
  const { children, title, index } = props
  return (
    <>
      {index !== 0 && (
        <li>
          <Divider variant="small"></Divider>
        </li>
      )}
      {title && (
        <ListItem>
          <Typography group="navigation" variant="label">
            {title}
          </Typography>
        </ListItem>
      )}
      {children}
    </>
  )
})

MenuSection.propTypes = {
  /** @ignore */
  index: PropTypes.number,
  /** @ignore */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf([PropTypes.node]),
    PropTypes.node,
  ]).isRequired,
  /** Active Menu Item */
  title: PropTypes.string,
}

MenuSection.defaultProps = {
  className: '',
  title: undefined,
  index: undefined,
}

MenuSection.displayName = 'eds-menu-section'
