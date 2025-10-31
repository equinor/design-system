import {
  Children,
  forwardRef,
  HTMLAttributes,
  ReactElement,
  useMemo,
  useState,
} from 'react'
import styled, { css } from 'styled-components'
import {
  bordersTemplate,
  outlineTemplate,
  mergeRefs,
  useId,
} from '@equinor/eds-utils'
import {
  arrow_drop_down,
  IconData,
  chevron_down,
  chevron_up,
} from '@equinor/eds-icons'

import { useSideBar } from '../SideBar.context'
import { sidebar as tokens } from '../SideBar.tokens'
import { Tooltip as EDSTooltip } from '../../Tooltip'
import { Typography } from '../../Typography'
import { Icon } from '../../Icon'
import { Menu } from '../../Menu'
import { AccordionItemProps } from '../SideBarAccordionItem'

const {
  minWidth,
  entities: {
    sidebarItem: {
      minHeight,
      border,
      typography: { color: typographyColor },
      states: {
        active: {
          background: menuActiveBackground,
          typography: { color: typographyActiveColor },
        },
        hover: { background: menuHoverBackground },
        focus,
        disabled: {
          background: menuDisabledBackground,
          typography: { color: menuDisabledText },
        },
      },
    },
  },
} = tokens

const MenuItem = styled.div<{ $isExpanded?: boolean }>(({ $isExpanded }) => {
  return css`
    display: grid;
    grid-template-columns: 1fr;
    place-items: center;
    text-decoration: none;
    min-height: ${minHeight};
    ${!$isExpanded && bordersTemplate(border)};

    &:hover {
      cursor: pointer;
      background-color: ${!$isExpanded ? menuHoverBackground : 'none'};
    }

    &:focus-visible {
      ${outlineTemplate(focus.outline)};
    }
  `
})

const AccordionHeader = styled.h2<{ $active?: boolean }>(({ $active }) => {
  return css`
    margin: 0;
    width: 100%;
    min-height: ${minHeight};
    background-color: ${$active ? menuActiveBackground : 'none'};

    &:hover {
      cursor: pointer;
      background-color: ${$active ? menuActiveBackground : menuHoverBackground};
    }
  `
})

const Button = styled.button<{ $active?: boolean }>(({ $active }) => {
  return css`
    width: 100%;
    min-height: ${minHeight};
    padding: 0;
    border: none;
    background-color: ${$active ? menuActiveBackground : 'transparent'};
    cursor: pointer;
    display: grid;
    place-items: center;

    &:focus-visible {
      ${outlineTemplate(focus.outline)};
    }

    &:disabled {
      background-color: ${menuDisabledBackground};
      cursor: auto;
    }
  `
})

const OpenSidebarButton = styled(Button)`
  grid-template-columns: ${minWidth} 1fr 48px;
`

const ClosedSidebarButton = styled(Button)`
  grid-template-columns: ${minWidth};
  position: relative;
  overflow: hidden; // The AccordionIcon is rotated, so it stretches outside the edges of the button and needs to be cut off
`

const AccordionIcon = styled(Icon)`
  position: absolute;
  bottom: -10px;
  right: -10px;
  transform: rotate(-45deg);
`

const Panel = styled.div`
  width: 100%;
  ${bordersTemplate(border)}
`

const ItemText = styled(Typography)<{ $textColor?: string }>(({
  $textColor,
}) => {
  return css`
    justify-self: start;
    color: ${$textColor};
    &::first-letter {
      text-transform: capitalize;
    }
  `
})

const Tooltip = styled(EDSTooltip)`
  text-transform: capitalize;
`

export type SidebarAccordionProps = {
  /** Label text */
  label: string
  /** Icon */
  icon: IconData
  /** Optional unique id for Accordion */
  id?: string
  /** Active/current url */
  active?: boolean
  /** Is the accordion expanded - use it if the accordion is controlled */
  isExpanded?: boolean
  /** Toggle accordion expanded - use it if you want to make the accordion controlled */
  toggleExpand?: () => void
  /** Optional callback when accordion is clicked - called after toggleExpand if it exists */
  onClick?: () => void
  /** Optionally disable component */
  disabled?: boolean
} & HTMLAttributes<HTMLButtonElement>

export const SideBarAccordion = forwardRef<
  HTMLButtonElement,
  SidebarAccordionProps
>(function SideBarAccordion(
  {
    icon,
    label,
    isExpanded,
    id,
    active,
    toggleExpand,
    onClick,
    children,
    disabled,
    ...rest
  },
  ref,
) {
  const accordionId: string = useId(id, 'accordion')
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false)
  const [accordionIsOpen, setAccordionIsOpen] = useState<boolean>(isExpanded)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>(null)
  const { isOpen } = useSideBar()
  const showPanel = toggleExpand !== undefined ? isExpanded : accordionIsOpen

  const showAsActive = useMemo(() => {
    // Active-state is controlled
    if (active !== undefined) {
      return active
    }

    let hasActiveChild = false

    Children.forEach(children, (child) => {
      const item = child as ReactElement<AccordionItemProps>
      if (item.props.active) {
        hasActiveChild = true
      }
    })

    // When Sidebar is expanded, we only show accordion header as active if the accordion is closed, to avoid showing two active items at the same time.
    return isOpen ? !showPanel && hasActiveChild : hasActiveChild
  }, [active, children, showPanel, isOpen])

  const combinedRefs = useMemo(
    () => mergeRefs<HTMLButtonElement>(setAnchorEl, ref),
    [ref],
  )

  const closeMenu = () => {
    setMenuIsOpen(false)
  }

  const onClickWhenSidePanelExpanded = () => {
    if (toggleExpand === undefined) {
      setAccordionIsOpen(!accordionIsOpen)
    } else {
      toggleExpand()
    }
    onClick && onClick()
  }

  const onClickWhenSidePanelClosed = () => {
    setMenuIsOpen(!menuIsOpen)
    onClick && onClick()
  }

  const getTextColor = () => {
    if (showAsActive) {
      return typographyActiveColor
    } else if (disabled) {
      return menuDisabledText
    }
    return typographyColor
  }

  if (isOpen) {
    return (
      <MenuItem $isExpanded={showPanel}>
        <AccordionHeader $active={showAsActive}>
          <OpenSidebarButton
            ref={ref}
            id={`header_${accordionId}`}
            aria-expanded={showPanel}
            aria-controls={`panel_${accordionId}`}
            onClick={onClickWhenSidePanelExpanded}
            disabled={disabled}
            {...rest}
          >
            {icon && <Icon data={icon} color={getTextColor()} />}
            <ItemText
              variant="cell_text"
              group="table"
              $textColor={getTextColor()}
            >
              {label}
            </ItemText>
            <Icon
              data={showPanel ? chevron_up : chevron_down}
              size={24}
              color={getTextColor()}
            />
          </OpenSidebarButton>
        </AccordionHeader>
        {showPanel && (
          <Panel
            id={`panel_${accordionId}`}
            role="region"
            aria-labelledby={`header_${accordionId}`}
          >
            {children}
          </Panel>
        )}
      </MenuItem>
    )
  }

  const tooltip = menuIsOpen ? '' : label

  return (
    <>
      <Tooltip title={tooltip} placement="right">
        <MenuItem $isExpanded={showPanel}>
          <AccordionHeader $active={showAsActive}>
            <ClosedSidebarButton
              ref={combinedRefs}
              id="anchor-default"
              aria-haspopup="true"
              aria-expanded={menuIsOpen}
              aria-controls="menu-default"
              onClick={onClickWhenSidePanelClosed}
              disabled={disabled}
              {...rest}
            >
              {icon && <Icon data={icon} color={getTextColor()} />}
              <AccordionIcon
                data={arrow_drop_down}
                size={24}
                color={getTextColor()}
              />
            </ClosedSidebarButton>
          </AccordionHeader>
        </MenuItem>
      </Tooltip>
      <Menu
        open={menuIsOpen}
        placement={'right-start'}
        onClose={closeMenu}
        anchorEl={anchorEl}
      >
        {Children.map(
          children,
          (child: ReactElement<SidebarAccordionProps>) => {
            return <Menu.Item {...child.props}>{child.props.label}</Menu.Item>
          },
        )}
      </Menu>
    </>
  )
})

SideBarAccordion.displayName = 'SidebarAccordion'
