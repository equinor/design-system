import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { layers, chevron_down, chevron_up } from '@equinor/eds-icons'
import { Icon, Typography } from '..'
import { accordion as tokens } from './Accordion.tokens'

Icon.add({ chevron_down, chevron_up })

const StyledAccordionHeader = styled.div`
  background: lime;
`

const HeaderButton = styled.button.attrs(({ panelId, isExpanded }) => ({
  'aria-expanded': isExpanded,
  'aria-controls': panelId,
}))`
  margin: 0;
  padding: 0;
  appearance: none;
  border: none;
  height: 48px;
  width: 100%;
  background: orange;
  font-size: inherit;
  display: flex;
  cursor: pointer;
  outline: none;
  align-items: center;
  padding-left: 16px;
  padding-right: 16px;
`

const Header = styled.h2`
  font-size: 16px;
  margin: 0;
`

const StyledIcon = styled(Icon)`
  ${({ chevronPosition }) =>
    chevronPosition === 'left'
      ? css`
          /* margin-left: 16px; */
          margin-right: 32px;
        `
      : css`
          margin-left: 16px;
          /* margin-right: 16px; */
        `}
`

const AccordionSummary = styled.span`
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
  return (
    <StyledAccordionHeader {...props} ref={ref}>
      <Header as={variant}>
        <HeaderButton
          id={id}
          type="button"
          isExpanded={isExpanded}
          panelId={panelId}
        >
          {chevronPosition === 'right' && children}
          <StyledIcon
            name={isExpanded ? 'chevron_up' : 'chevron_down'}
            size={16}
            chevronPosition={chevronPosition}
          />
          {chevronPosition === 'left' && children}
        </HeaderButton>
      </Header>
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

export { AccordionHeader, AccordionSummary }
