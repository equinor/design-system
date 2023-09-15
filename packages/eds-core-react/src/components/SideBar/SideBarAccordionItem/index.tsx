import { forwardRef, AnchorHTMLAttributes, ElementType } from 'react'
import styled, { css } from 'styled-components'
import { OverridableComponent, outlineTemplate } from '@equinor/eds-utils'

import { Typography } from '../../Typography'
import { sidebar as tokens } from '../SideBar.tokens'
import { useSideBar } from '../SideBar.context'

const {
  minWidth,
  entities: {
    sidebarItem: {
      minHeight,
      typography: { color: typographyColor },
      states: {
        active: {
          background: menuActiveBackground,
          typography: { color: typographyActiveColor },
        },
        focus,
        hover: { background: menuHoverBackground },
      },
    },
  },
} = tokens

const Container = styled.a<{ $active?: boolean }>(({ $active }) => {
  return css`
    display: grid;
    grid-template-columns: ${minWidth} 1fr;
    justify-items: stretch;
    background-color: ${$active ? menuActiveBackground : 'transparent'};
    cursor: pointer;
    text-decoration: none;
    border: 0;
    width: 100%;
    padding: 0;

    &:hover {
      background-color: ${$active ? menuActiveBackground : menuHoverBackground};
    }

    &:focus-visible {
      ${outlineTemplate(focus.outline)};
    }
  `
})

const TextWrapper = styled.div`
  min-height: ${minHeight};
  grid-column: 2;
  justify-self: start;
  display: flex;
  align-items: center;
  width: 100%;
`

const Text = styled(Typography)<{ $active?: boolean }>(({ $active }) => {
  return css`
    color: ${$active ? typographyActiveColor : typographyColor};
    width: 100%;

    &::first-letter {
      text-transform: capitalize;
    }
  `
})

type OverridableSubComponent = OverridableComponent<
  AccordionItemProps,
  HTMLAnchorElement
> & {
  displayName?: string
}

export type AccordionItemProps = {
  /** Label text */
  label: string
  /** Active/current url */
  active?: boolean
  onClick?: () => void
  as?: ElementType
} & AnchorHTMLAttributes<HTMLAnchorElement>

export const SideBarAccordionItem: OverridableSubComponent = forwardRef<
  HTMLAnchorElement,
  AccordionItemProps
>(function SidebarLink({ label, active, onClick, as = 'a', ...rest }, ref) {
  const { isOpen } = useSideBar()

  if (isOpen) {
    return (
      <Container
        as={as}
        tabIndex={0}
        $active={active}
        onClick={onClick}
        ref={ref}
        {...rest}
      >
        <TextWrapper>
          <Text variant="cell_text" group="table" $active={active}>
            {label}
          </Text>
        </TextWrapper>
      </Container>
    )
  }
  return null
})

SideBarAccordionItem.displayName = 'SideBarAccordionItem'
