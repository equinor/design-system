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

const {
  entities: { chevron: chevronToken },
} = tokens

const StyledAccordionHeader = styled.div`
  margin: 0;
  padding: 0;
`

type StyledAccordionHeaderButtonProps = {
  /** The ID of the panel */
  panelId?: string
  /**  Is AccordionItem expanded */
  isExpanded?: boolean
  /** Accordion item is disabled */
  disabled?: boolean
  /**  The ID of the parent */
  parentIndex?: number
}

const StyledAccordionHeaderButton =
  styled.button.attrs<StyledAccordionHeaderButtonProps>(
    ({ panelId, isExpanded, disabled }) => ({
      'aria-expanded': isExpanded,
      'aria-controls': panelId,
      'aria-disabled': isExpanded && disabled,
      tabIndex: disabled ? -1 : 0,
      disabled,
    }),
  )<StyledAccordionHeaderButtonProps>(({ theme, disabled, parentIndex }) => {
    const {
      entities: { header, icon: iconToken },
      border,
    } = theme
    return css`
      ${typographyTemplate(header.typography)}
      ${bordersTemplate(border)}
      ${spacingsTemplate(header.spacings)}
      &[data-focus-visible-added]:focus {
        ${outlineTemplate(header.states.focus.outline)}
      }
      &:focus-visible {
        ${outlineTemplate(header.states.focus.outline)}
      }
      border-top: ${parentIndex === 0 ? null : 'none'};
      width: 100%;
      background: ${header.background};
      height: ${header.height};
      margin: 0;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      ${disabled
        ? css({
            color: header.states.disabled.typography.color,
            cursor: 'not-allowed',
          })
        : css({
            color: header.typography.color,
            cursor: 'pointer',
            '@media (hover: hover) and (pointer: fine)': {
              ':hover': {
                background: header.states.hover.background,
              },
            },
          })}
      > svg {
        color: ${iconToken.typography.color};
      }
    `
  })

type StyledIconProps = Omit<AccordionProps, 'headerLevel'>

const StyledIcon = styled(Icon)(({ chevronPosition }: StyledIconProps) =>
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
  HTMLAttributes<HTMLButtonElement>

type AccordionChild = {
  type: { displayName: string }
} & ReactElement

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
        data={isExpanded ? chevron_up : chevron_down}
        size={24}
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
      <StyledAccordionHeader as={headerLevel}>
        <StyledAccordionHeaderButton
          isExpanded={isExpanded}
          parentIndex={parentIndex}
          disabled={disabled}
          panelId={panelId}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          ref={ref}
          {...props}
        >
          {chevronPosition === 'left' ? newChildren : newChildren.reverse()}
        </StyledAccordionHeaderButton>
      </StyledAccordionHeader>
    )
  },
)

// AccordionHeader.displayName = 'EdsAccordionHeader'

export { AccordionHeader }
