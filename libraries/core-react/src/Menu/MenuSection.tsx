import React, { ReactNode } from 'react'
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

export type MenuSectionProps = {
  index: number
  title?: string
  children: ReactNode
}

export const MenuSection = React.memo(function EdsMenuSection(
  props: MenuSectionProps,
) {
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

MenuSection.displayName = 'eds-menu-section'
