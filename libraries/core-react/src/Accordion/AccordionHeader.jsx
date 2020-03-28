import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { chevron_down, chevron_up } from '@equinor/eds-icons'
import { Icon, Typography } from '..'
import { accordion as tokens } from './Accordion.tokens'
import { commonPropTypes, commonDefaultProps } from './Accordion.propTypes'

Icon.add({ chevron_down, chevron_up })

const StyledAccordionHeader = styled.div`
  font-size: 16px;
  margin: 0;
  display: flex;
`

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
  background: orange;
  font-size: inherit;
  flex: 1;
  display: flex;
  cursor: pointer;
  padding-left: 16px;
  padding-right: 16px;
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
  { headerLevel, chevronPosition, panelId, id, isExpanded, children, ...props },
  ref,
) {
  const headerChildren = React.Children.map(children, (child) => {
    const chevron = (
      <StyledIcon
        key={`${id}-icon`}
        name={isExpanded ? 'chevron_up' : 'chevron_down'}
        size={16}
        chevronPosition={chevronPosition}
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
          },
          chevronPosition === 'left'
            ? headerButtonChildren
            : headerButtonChildren.reverse(),
        )
      : child
  })

  return (
    <StyledAccordionHeader as={headerLevel} {...props} ref={ref}>
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
}

AccordionHeader.defaultProps = {
  ...commonDefaultProps,
  id: '',
  panelId: null,
  isExpanded: false,
}

export { AccordionHeader, HeaderButton as AccordionButton }
