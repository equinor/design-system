import React, { forwardRef, ReactElement } from 'react'
import styled from 'styled-components'
import type { CSSObject } from 'styled-components'
// eslint-disable-next-line camelcase
import { chevron_down, chevron_up } from '@equinor/eds-icons'
import { Icon } from '..'
import { accordion as tokens } from './Accordion.tokens'
import { Property } from 'csstype'
import type { AccordianProps } from './Accordion.types'

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

type StyledAccordianHeader = {
  panelId?: string
  isExpanded?: boolean
  disabled?: boolean
  parentIndex?: number
}

const StyledAccordionHeader = styled.div.attrs<StyledAccordianHeader>(
  ({ panelId, isExpanded, disabled }): JSX.IntrinsicElements['button'] => ({
    'aria-expanded': isExpanded,
    'aria-controls': panelId,
    role: 'button',
    'aria-disabled': isExpanded && disabled,
    tabIndex: disabled ? -1 : 0,
    disabled,
  }),
)(
  ({ parentIndex, disabled }: StyledAccordianHeader): CSSObject => ({
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight as number,
    lineHeight: typography.lineHeight,
    textAlign: typography.textAlign as Property.TextAlign,
    margin: 0,
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    borderTop: parentIndex === 0 ? border : 'none',
    borderRight: border,
    borderBottom: border,
    borderLeft: border,
    boxSizing: 'border-box',
    color: (disabled && headerColor.disabled) || headerColor.default,
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
)(({ chevronPosition }: Omit<AccordianProps, 'headerLevel'>) =>
  chevronPosition === 'left' ? { marginRight: '32px' } : { marginLeft: '16px' },
)

type AccordionHeaderTitleProps = Props & Partial<AccordianProps>

const AccordionHeaderTitle = styled.span<AccordionHeaderTitleProps>`
  flex: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  text-align: left;
  font-family: Equinor;
  color: ${({ isExpanded, disabled }) =>
    isExpanded && !disabled ? headerColor.activated : 'inherit'};
`

AccordionHeaderTitle.displayName = 'eds-accordion-headertitle'

type Props = {
  /** The id of the button that toggles expansion */
  id?: string
  /** Is AccordionItem expanded */
  isExpanded?: boolean
  /** The panel that is controlled by the HeaderButton */
  panelId?: string
  /** The index of the parent AccordionItem  */
  parentIndex?: number
  /** accordion item is disabled */
  disabled?: boolean
  /** @internal */
  toggleExpanded?: () => void
}

type AccordianChild = {
  type: { displayName: string }
} & ReactElement

const AccordionHeader = forwardRef<
  HTMLDivElement,
  Props & Partial<AccordianProps> & JSX.IntrinsicElements['div']
>(function AccordionHeader(
  {
    parentIndex,
    headerLevel,
    chevronPosition,
    panelId,
    id,
    isExpanded,
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
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const { key } = event
    if (key === 'Enter' || key === ' ') {
      toggleExpanded()
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
    (child: AccordianChild) => {
      return (
        (typeof child === 'string' && (
          <AccordionHeaderTitle isExpanded={isExpanded} disabled={disabled}>
            {child}
          </AccordionHeaderTitle>
        )) ||
        (child.type.displayName === 'eds-accordion-headertitle' &&
          React.cloneElement(child, {
            isExpanded,
            disabled,
          })) ||
        child
      )
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
})

AccordionHeader.displayName = 'eds-accordion-header'

export { AccordionHeader, AccordionHeaderTitle }
