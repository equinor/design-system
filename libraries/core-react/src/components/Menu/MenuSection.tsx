import * as React from 'react'
import { ReactNode } from 'react'
import styled from 'styled-components'
import { menu as tokens } from './Menu.tokens'
import { spacingsTemplate } from '../../utils'
import { Divider } from '../Divider'
import { Typography } from '../Typography'

const ListItem = styled.div.attrs(() => ({
  tabIndex: 0,
}))`
  ${spacingsTemplate(tokens.entities.title.spacings)}
  &:focus {
    outline: none;
  }
`

export type MenuSectionProps = {
  /** @ignore */
  index?: number
  /** @ignore */
  children: ReactNode
  /** Section title */
  title?: string
}

export const MenuSection = React.memo(function MenuSection(
  props: MenuSectionProps,
) {
  const { children, title, index } = props
  return (
    <>
      {index !== 0 && (
        <div>
          <Divider variant="small"></Divider>
        </div>
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

// MenuSection.displayName = 'EdsMenuSection'
