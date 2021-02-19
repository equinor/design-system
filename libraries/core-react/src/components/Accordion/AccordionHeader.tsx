import * as React from 'react'
import { forwardRef, HTMLAttributes, isValidElement, ReactElement } from 'react'
import styled from 'styled-components'
import type { CSSObject } from 'styled-components'
// eslint-disable-next-line camelcase
import { chevron_down, chevron_up } from '@equinor/eds-icons'
import { Icon } from '../Icon'
import { AccordionHeaderTitle } from './AccordionHeaderTitle'
import { accordion as tokens } from './Accordion.tokens'
import type { AccordionProps } from './Accordion.types'

Icon.add({ chevron_down, chevron_up })

const {
  header: { color: headerColor, background: headerBackground, typography },
  border,
  chevronColor: {
    default: chevronDefaultColor,
    disabled: chevronDisabledColor,
  },
  outline,
  outlineOffset,
} = tokens

type StyledAccordionHeaderProps = {
  /** The ID of the panel */
  panelId?: string
  /**  Is AccordionItem expanded */
  isExpanded?: boolean
  /** Accordion item is disabled */
  disabled?: boolean
  /**  The ID of the parent */
  parentIndex?: number
}

const StyledAccordionHeader = styled.div.attrs<StyledAccordionHeaderProps>(
  ({ panelId, isExpanded, disabled }): JSX.IntrinsicElements['button'] => ({
    'aria-expanded': isExpanded,
    'aria-controls': panelId,
    role: 'button',
    'aria-disabled': isExpanded && disabled,
    tabIndex: disabled ? -1 : 0,
    disabled,
  }),
)(
  ({ parentIndex, disabled }: StyledAccordionHeaderProps): CSSObject => ({
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight as number,
    lineHeight: typography.lineHeight,
    textAlign: typography.textAlign as CSSObject['textAlign'],
    margin: 0,
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    borderTop: parentIndex === 0 ? border : 'none',
    borderRight: border,
    borderBottom: border,
    borderLeft: border,
    boxSizing: 'border-box',
    color:
      (disabled &&
        `var(--eds_infographic_substitute__pink_salmon, ${headerColor.disabled})`) ||
      headerColor.default,
    outline: 'none',
    '&[data-focus-visible-added]:focus': {
      outline,
      outlineOffset,
    },
    '&:hover': !disabled && { background: headerBackground.hover },
    cursor: disabled ? 'not-allowed' : 'pointer',
    paddingLeft: '16px',
    paddingRight: '16px',
  }),
)

const StyledIcon = styled(
  Icon,
)(({ chevronPosition }: Omit<AccordionProps, 'headerLevel'>) =>
  chevronPosition === 'left' ? { marginRight: '32px' } : { marginLeft: '16px' },
)

type AccordionHeaderProps = {
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
  HTMLAttributes<HTMLDivElement>

type AccordionChild = {
  type: { displayName: string }
} & ReactElement

const AccordionHeader = forwardRef<HTMLDivElement, AccordionHeaderProps>(
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
      ...props
    },
    ref,
  ) {
    const handleClick = () => {
      if (!disabled) {
        toggleExpanded()
        if (props.onToggle) {
          props.onToggle()
        }
      }
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
      const { key } = event
      if (key === 'Enter' || key === ' ') {
        toggleExpanded()
        if (props.onToggle) {
          props.onToggle()
        }
        event.preventDefault()
      }
    }

    const chevron = (
      <StyledIcon
        key={`${id}-icon`}
        name={isExpanded ? 'chevron_up' : 'chevron_down'}
        size={16}
        chevronPosition={chevronPosition}
        color={disabled ? chevronDisabledColor : chevronDefaultColor}
      />
    )

    const headerChildren = React.Children.map(
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
          return React.cloneElement(child, {
            isExpanded,
            disabled,
          })
        }

        return child
      },
    )

    const newChildren = [chevron, headerChildren]

    return (
      <StyledAccordionHeader
        isExpanded={isExpanded}
        parentIndex={parentIndex}
        as={headerLevel}
        disabled={disabled}
        {...props}
        panelId={panelId}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        ref={ref}
      >
        {chevronPosition === 'left' ? newChildren : newChildren.reverse()}
      </StyledAccordionHeader>
    )
  },
)

// AccordionHeader.displayName = 'EdsAccordionHeader'

export { AccordionHeader }
