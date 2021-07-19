import {
  KeyboardEvent,
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
import { accordion as tokens } from './Accordion.tokens'
import type { AccordionProps } from './Accordion.types'
import {
  typographyTemplate,
  bordersTemplate,
  spacingsTemplate,
  outlineTemplate,
} from '../../utils'

Icon.add({ chevron_down, chevron_up })

const {
  entities: { header, chevron: chevronToken },
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
  ({ panelId, isExpanded, disabled }) => ({
    'aria-expanded': isExpanded,
    'aria-controls': panelId,
    role: 'button',
    'aria-disabled': isExpanded && disabled,
    tabIndex: disabled ? -1 : 0,
    disabled,
  }),
)<StyledAccordionHeaderProps>`
  ${typographyTemplate(header.typography)}
  ${bordersTemplate(tokens.border)}
  ${spacingsTemplate(header.spacings)}
  &[data-focus-visible-added]:focus {
    ${outlineTemplate(header.states.focus.outline)}
  }
  border-top: ${({ parentIndex }) => (parentIndex === 0 ? null : 'none')};
  background: ${header.background};
  height: ${header.height};
  margin: 0;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  ${({ disabled }) =>
    disabled
      ? css({
          color: header.states.disabled.typography.color,
          cursor: 'not-allowed',
        })
      : css({
          color: header.typography.color,
          cursor: 'pointer',
          ':hover': {
            background: header.states.hover.background,
          },
        })}
`

const StyledIcon = styled(
  Icon,
)(({ chevronPosition }: Omit<AccordionProps, 'headerLevel'>) =>
  chevronPosition === 'left' ? { marginRight: '32px' } : { marginLeft: '16px' },
)

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

    const handleKeyDown = (event: KeyboardEvent) => {
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
