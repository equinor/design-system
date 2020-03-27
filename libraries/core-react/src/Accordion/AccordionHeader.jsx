import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { layers, chevron_down, chevron_up } from '@equinor/eds-icons'
import { Icon, Typography } from '..'
import { accordion as tokens } from './Accordion.tokens'

Icon.add({ chevron_down, chevron_up })

const StyledAccordionHeader = styled.div`
  background: lime;
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
  { panelId, id, chevronPosition, isExpanded, children, variant, ...props },
  ref,
) {
  const headerChildren = React.Children.map(children, (child) => {
    const chevron = (
      <StyledIcon
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
    <StyledAccordionHeader as={variant} {...props} ref={ref}>
      {headerChildren}
    </StyledAccordionHeader>
  )
})

AccordionHeader.displayName = 'eds-accordion-header'

AccordionHeader.propTypes = {
  /** The id of the button that toggles expansion */
  id: PropTypes.string,
  /** Is AccordionItem expanded */
  isExpanded: PropTypes.bool,
  /** Which side the chevron should be on  */
  chevronPosition: PropTypes.oneOf(['left', 'right']),
  /** The header level, i.e. h1, h2, h3 etc. */
  variant: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
  /** The panel that is controlled by the HeaderButton */
  panelId: PropTypes.string,
  /** @ignore */
  children: PropTypes.node.isRequired,
}

AccordionHeader.defaultProps = {
  id: '',
  panelId: null,
  isExpanded: false,
  chevronPosition: 'left',
  variant: 'h2',
}

export { AccordionHeader, HeaderButton as AccordionButton }
