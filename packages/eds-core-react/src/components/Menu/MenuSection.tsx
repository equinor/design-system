import { ReactNode, memo } from 'react'
import styled from 'styled-components'
import { menu as tokens } from './Menu.tokens'
import { spacingsTemplate } from '@equinor/eds-utils'
import { Divider } from '../Divider'
import { Typography } from '../Typography'

const Header = styled.div.attrs(() => ({
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

export const MenuSection = memo(function MenuSection(props: MenuSectionProps) {
  const { children, title, index } = props
  return (
    <>
      {index !== 0 && (
        <div>
          <Divider variant="small" />
        </div>
      )}
      {title && (
        <Header role="group">
          <Typography group="navigation" variant="label">
            {title}
          </Typography>
        </Header>
      )}
      {children}
    </>
  )
})

// MenuSection.displayName = 'EdsMenuSection'
