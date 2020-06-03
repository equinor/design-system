import React, { forwardRef, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { TooltipItem } from '.'

const Anchor = styled.div`
  position: relative;
  display: flex;
  width: auto;
  justify-content: center;
`

// Controller for TooltipItem
export const Tooltip = forwardRef(function Tooltip(
  { className, title, children, placement, ...rest },
  ref,
) {
  const [openState, setOpenState] = useState()

  const handleOpen = () => {
    setOpenState(true)
  }

  const handleClose = () => {
    setOpenState(false)
  }

  const props = {
    ...rest,
    className,
    ref,
  }

  return (
    <Anchor {...props}>
      <div
        onMouseOver={handleOpen}
        onMouseLeave={handleClose}
        onBlur={handleClose}
        onFocus={handleOpen}
      >
        {children}
      </div>
      {openState && <TooltipItem placement={placement} title={title} />}
    </Anchor>
  )
})

Tooltip.displayName = 'eds-tooltip'

Tooltip.propTypes = {
  // Tooltip placement relative to anchor
  placement: PropTypes.oneOf([
    'topLeft',
    'top',
    'topRight',
    'rightTop',
    'right',
    'rightBottom',
    'bottomLeft',
    'bottom',
    'bottomRight',
    'leftTop',
    'left',
    'leftBottom',
  ]),
  // Tooltip title
  title: PropTypes.string,
  /** Tooltip reference/anchor element */
  children: PropTypes.node.isRequired,
  /** @ignore */
  className: PropTypes.string,
}

Tooltip.defaultProps = {
  placement: 'bottom',
  title: '',
  className: '',
}
