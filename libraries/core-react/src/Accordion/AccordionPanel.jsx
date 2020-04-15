import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { accordion as tokens } from './Accordion.tokens'

const {
  header: {
    background: { backgroundDefault: background },
  },
  border,
} = tokens

const StyledAccordionPanel = styled.div.attrs(({ headerId }) => ({
  role: 'region',
  'aria-labelledby': headerId,
}))`
  background: ${background};
  border-right: ${border};
  border-bottom: ${border};
  border-left: ${border};
  min-height: 96px;
  padding: 16px;
  box-sizing: border-box;
`

/**
 * @typedef Props
 * @prop {string} [headerId] The ID of the element that controls the panel
 * @prop {string} [id] The ID of the panel
 * @prop {boolean} [hidden] If `true`, the panel will be hidden
 * @prop {React.ReactNode} children
 */

const AccordionPanel = forwardRef(
  /**
   * @param {Props & React.HTMLAttributes<HTMLDivElement>} props
   * @param ref
   */
  function AccordionPanel({ id, headerId, hidden, children, ...rest }, ref) {
    return (
      <StyledAccordionPanel
        headerId={headerId}
        id={id}
        hidden={hidden}
        {...rest}
        ref={ref}
      >
        {children}
      </StyledAccordionPanel>
    )
  },
)

AccordionPanel.displayName = 'eds-accordion-panel'

AccordionPanel.propTypes = {
  /** The ID of the element that controls the panel */
  headerId: PropTypes.string,
  /** The ID of the panel */
  id: PropTypes.string,
  /** If `true`, the panel will be hidden. */
  hidden: PropTypes.bool,
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node.isRequired,
}

AccordionPanel.defaultProps = {
  headerId: '',
  id: '',
  className: '',
  hidden: null,
}

export { AccordionPanel }
