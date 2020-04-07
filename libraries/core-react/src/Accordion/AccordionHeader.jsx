import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
// eslint-disable-next-line camelcase
import { chevron_down, chevron_up } from '@equinor/eds-icons'
import { Icon } from '..'
import { accordion as tokens } from './Accordion.tokens'
import { commonPropTypes, commonDefaultProps } from './Accordion.propTypes'

Icon.add({ chevron_down, chevron_up })

const {
  header: { color: headerColor, background: headerBackground, ...header },
  border,
  chevronColor: {
    default: chevronDefaultColor,
    disabled: chevronDisabledColor,
  },
  outline,
  outlineOffset,
} = tokens

const StyledAccordionHeader = styled.div.attrs(
  ({ panelId, isExpanded, disabled, parentIndex }) => ({
    'aria-expanded': isExpanded,
    'aria-controls': panelId,
    role: 'button',
    disabled,
    'aria-disabled': isExpanded && disabled,
    tabIndex: disabled ? '-1' : '0',
  }),
)(({ parentIndex, disabled, focusVisible }) => ({
  ...header,
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
  '&:focus': !disabled &&
    focusVisible && {
      outline,
      outlineOffset,
    },
  '&:hover': !disabled && { background: headerBackground.hover },
  cursor: disabled ? 'not-allowed' : 'pointer',
  paddingLeft: '16px',
  paddingRight: '16px',
}))

const StyledIcon = styled(Icon)(({ chevronPosition }) =>
  chevronPosition === 'left' ? { marginRight: '32px' } : { marginLeft: '16px' },
)

const AccordionHeaderTitle = styled.span`
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

const AccordionHeader = forwardRef(function AccordionHeader(
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
    focusVisible,
    handleFocusVisible,
    ...props
  },
  ref,
) {
  const handleClick = () => {
    handleFocusVisible(false)
    if (!disabled) {
      toggleExpanded()
    }
  }

  const handleMouseDown = () => {
    handleFocusVisible(false)
  }

  const handleKeyDown = (event) => {
    const { key } = event
    handleFocusVisible(true)
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

  const headerChildren = React.Children.map(children, (child) => {
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
  })

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
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
      focusVisible={focusVisible}
      ref={ref}
    >
      {chevronPosition === 'left' ? newChildren : newChildren.reverse()}
    </StyledAccordionHeader>
  )
})

AccordionHeader.displayName = 'eds-accordion-header'

AccordionHeader.propTypes = {
  ...commonPropTypes,
  /** The id of the button that toggles expansion */
  id: PropTypes.string,
  /** Is AccordionItem expanded */
  isExpanded: PropTypes.bool,
  /** The panel that is controlled by the HeaderButton */
  panelId: PropTypes.string,
  /** @ignore */
  children: PropTypes.node.isRequired,
  /** The index of the parent AccordionItem  */
  parentIndex: PropTypes.number,
  /** accordion item is disabled */
  disabled: PropTypes.bool,
  /** @ignore */
  focusVisible: PropTypes.bool,
  /** @ignore */
  handleFocusVisible: PropTypes.func,
}

AccordionHeader.defaultProps = {
  ...commonDefaultProps,
  id: '',
  panelId: null,
  isExpanded: false,
  parentIndex: null,
  disabled: false,
  focusVisible: true,
  handleFocusVisible: () => {},
}

export { AccordionHeader, AccordionHeaderTitle }
