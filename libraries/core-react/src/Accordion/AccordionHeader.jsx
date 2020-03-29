import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { chevron_down, chevron_up } from '@equinor/eds-icons'
import { Icon, Typography } from '..'
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

const StyledAccordionHeader = styled.div(
  ({ isExpanded, parentIndex, clickHandler }) => ({
    ...header,
    margin: 0,
    display: 'flex',
    borderTop: parentIndex === 0 ? border : 'none',
    borderRight: border,
    borderBottom: border,
    borderLeft: border,
    boxSizing: 'border-box',
    color: isExpanded ? headerColor.activated : headerColor.default,
    '&:focus-within': {
      outline,
      outlineOffset,
    },
    '&:hover': { background: headerBackground.hover },
  }),
)

const HeaderButton = styled.button.attrs(({ panelId, isExpanded }) => ({
  'aria-expanded': isExpanded,
  'aria-controls': panelId,
  type: 'button',
}))`
  margin: 0;
  padding: 0;
  appearance: none;
  border: none;
  height: 48px;
  width: 100%;
  background: transparent;
  color: inherit;
  font-size: inherit;
  flex: 1;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding-left: 16px;
  padding-right: 16px;
  outline: none;
`

HeaderButton.displayName = 'eds-accordion-headerbutton'

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
`

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
    ...props
  },
  ref,
) {
  // console.log(tokens)

  const headerChildren = React.Children.map(children, (child) => {
    const chevron = (
      <StyledIcon
        key={`${id}-icon`}
        name={isExpanded ? 'chevron_up' : 'chevron_down'}
        size={16}
        chevronPosition={chevronPosition}
        color={chevronDefaultColor}
      />
    )

    const grandChildren = React.Children.map(
      child.props.children,
      (grandChild) =>
        typeof grandChild === 'string' ? (
          <AccordionHeaderTitle>{grandChild}</AccordionHeaderTitle>
        ) : (
          grandChild
        ),
    )

    const headerButtonChildren = [chevron, grandChildren]

    return child.type.displayName === 'eds-accordion-headerbutton'
      ? React.cloneElement(
          child,
          {
            id,
            isExpanded,
            panelId,
            onClick: toggleExpanded,
          },
          chevronPosition === 'left'
            ? headerButtonChildren
            : headerButtonChildren.reverse(),
        )
      : child
  })

  return (
    <StyledAccordionHeader
      isExpanded={isExpanded}
      parentIndex={parentIndex}
      as={headerLevel}
      {...props}
      ref={ref}
    >
      {headerChildren}
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
}

AccordionHeader.defaultProps = {
  ...commonDefaultProps,
  id: '',
  panelId: null,
  isExpanded: false,
  parentIndex: null,
}

export { AccordionHeader, HeaderButton as AccordionButton }
