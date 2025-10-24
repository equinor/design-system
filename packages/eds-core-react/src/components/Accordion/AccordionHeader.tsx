import {
  KeyboardEvent,
  MouseEvent,
  Children as ReactChildren,
  cloneElement,
  forwardRef,
  HTMLAttributes,
  isValidElement,
  ReactElement,
} from 'react'
import styled, { css } from 'styled-components'
import { chevron_down, chevron_up } from '@equinor/eds-icons'
import { Icon } from '../Icon'
import { AccordionHeaderTitle } from './AccordionHeaderTitle'
import { AccordionHeaderActions } from './AccordionHeaderActions'
import { accordion as tokens } from './Accordion.tokens'
import type { AccordionProps } from './Accordion.types'
import {
  typographyTemplate,
  bordersTemplate,
  spacingsTemplate,
  outlineTemplate,
} from '@equinor/eds-utils'

const {
  entities: { chevron: chevronToken },
} = tokens

const StyledAccordionHeader = styled.div<StyledAccordionHeaderButtonProps>(
  ({ theme, disabled, $parentIndex }) => {
    const {
      entities: { header },
      border,
    } = theme
    return css`
      margin: 0;
      padding: 0;
      height: ${header.height};
      box-sizing: border-box;
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      background-color: ${header.background};
      ${bordersTemplate(border)}
      border-top: ${$parentIndex === 0 ? null : 'none'};
      ${disabled
        ? css`
            color: ${header.states.disabled.typography.color};
            cursor: not-allowed;
          `
        : css`
            color: ${header.typography.color};
            cursor: pointer;
            @media (hover: hover) and (pointer: fine) {
              &:hover {
                background: ${header.states.hover.background};
              }
            }
          `}
    `
  },
)

type StyledAccordionHeaderButtonProps = {
  /** The ID of the panel */
  $panelId?: string
  /**  Is AccordionItem expanded */
  $isExpanded?: boolean
  /** Accordion item is disabled */
  disabled?: boolean
  /**  The ID of the parent */
  $parentIndex?: number
}

const StyledAccordionHeaderButton =
  styled.button.attrs<StyledAccordionHeaderButtonProps>(
    ({ $panelId, $isExpanded, disabled }) => ({
      'aria-expanded': $isExpanded,
      'aria-controls': $panelId,
      'aria-disabled': $isExpanded && disabled,
      tabIndex: disabled ? -1 : 0,
      disabled,
    }),
  )<StyledAccordionHeaderButtonProps>(({ theme, disabled }) => {
    const {
      entities: { header, icon: iconToken },
    } = theme
    return css`
      ${typographyTemplate(header.typography)}
      ${spacingsTemplate(header.spacings)}
      &[data-focus-visible-added]:focus {
        ${outlineTemplate(header.states.focus.outline)}
      }
      &:focus-visible {
        ${outlineTemplate(header.states.focus.outline)}
      }
      border: 0;
      background-color: transparent;
      margin: 0;
      display: flex;
      align-items: center;
      flex-grow: 1;
      ${disabled
        ? css({
            color: header.states.disabled.typography.color,
            cursor: 'not-allowed',
          })
        : css({
            color: header.typography.color,
            cursor: 'pointer',
          })}
      > svg {
        color: ${iconToken.typography.color};
      }
    `
  })

const StyledIcon = styled(Icon)<{ $chevronPosition: 'left' | 'right' }>(({
  $chevronPosition,
}) => {
  return css`
    flex-shrink: 0;
    ${$chevronPosition === 'left'
      ? css({ marginRight: '32px' })
      : css({ marginLeft: '16px' })}
  `
})

export type AccordionHeaderProps = {
  /** The id of the button that toggles expansion */
  id?: string
  /**  Is AccordionItem expanded */
  isExpanded?: boolean
  /**  The panel that is controlled by the HeaderButton */
  panelId?: string
  /**  The index of the parent AccordionItem  */
  parentIndex?: number
  /** Accordion item is disabled */
  disabled?: boolean
  /** @ignore */
  toggleExpanded?: () => void
  /** Accordion item toggle callback */
  onToggle?: () => void
} & AccordionProps &
  HTMLAttributes<HTMLButtonElement>

type AccordionChild = ReactElement<{
  isExpanded?: boolean
  disabled?: boolean
}> & {
  type: { displayName: string }
}

const AccordionHeader = forwardRef<HTMLButtonElement, AccordionHeaderProps>(
  function AccordionHeader(
    {
      parentIndex,
      headerLevel,
      chevronPosition,
      panelId,
      id,
      isExpanded = false,
      children,
      toggleExpanded,
      disabled,
      className,
      style,
      ...props
    },
    ref,
  ) {
    const handleClick = (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!disabled) {
        toggleExpanded()
        if (props.onToggle) {
          props.onToggle()
        }
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      const { key } = e
      if (key === 'Enter' || key === ' ') {
        toggleExpanded()
        if (props.onToggle) {
          props.onToggle()
        }
        e.preventDefault()
        e.stopPropagation()
      }
    }

    const chevron = (
      <StyledIcon
        key={`${id}-icon`}
        data={isExpanded ? chevron_up : chevron_down}
        size={24}
        $chevronPosition={chevronPosition}
        color={
          disabled
            ? chevronToken.states.disabled.background
            : chevronToken.background
        }
      />
    )

    const headerChildren = ReactChildren.map(
      children,
      (child: AccordionChild) => {
        if (typeof child === 'string') {
          return (
            <AccordionHeaderTitle isExpanded={isExpanded} disabled={disabled}>
              {child}
            </AccordionHeaderTitle>
          )
        }

        if (isValidElement(child) && child.type === AccordionHeaderTitle) {
          return cloneElement(child, {
            isExpanded,
            disabled,
          })
        }

        if (child.type === AccordionHeaderActions) {
          return
        }

        return child
      },
    )

    const headerActions = ReactChildren.map(
      children,
      (child: AccordionChild) => {
        if (isValidElement(child) && child.type === AccordionHeaderActions) {
          return cloneElement(child, {
            isExpanded,
            disabled,
          })
        }
      },
    )

    const newChildren = [chevron, headerChildren]

    return (
      <StyledAccordionHeader
        disabled={disabled}
        $parentIndex={parentIndex}
        as={headerLevel}
        className={className}
        style={style}
      >
        <StyledAccordionHeaderButton
          $isExpanded={isExpanded}
          disabled={disabled}
          $panelId={panelId}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          ref={ref}
          type="button"
          {...props}
        >
          {chevronPosition === 'left' ? newChildren : newChildren.reverse()}
        </StyledAccordionHeaderButton>
        {headerActions && headerActions}
      </StyledAccordionHeader>
    )
  },
)

export { AccordionHeader }
