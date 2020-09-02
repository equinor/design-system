import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { snackbar as tokens } from './Snackbar.tokens'
import { typographyTemplate } from '../_common/templates'

const StyledSnackbar = styled.div.attrs(() => ({
  role: 'alert',
}))`

  position: fixed;
  left: ${tokens.spacings.left};
  bottom: ${tokens.spacings.bottom};
  background-color: ${tokens.background};
  padding: ${tokens.spacings.padding};
  border-radius: ${tokens.borderRadius};
  ${typographyTemplate(tokens.text.typography)}
  color: ${tokens.text.color};
  box-shadow: ${tokens.boxShadow};
  min-height: ${tokens.minHeight};
  box-sizing: border-box;
  left: 50%;
  transform: translateX(-50%);
  @media (min-width: ${({ leftAlignFrom }) => leftAlignFrom}) {
    left: auto;
    transform: none;
  }

  a,
  button {
    color: ${tokens.buttonColor}
  }
`

export const Snackbar = ({
  open,
  autoHideDuration,
  onClose,
  leftAlignFrom,
  children,
  className,
}) => {
  const [visible, setVisible] = useState(open)
  useEffect(() => {
    setVisible(open)
    const timer = setTimeout(() => {
      setVisible(false)
      if (onClose) {
        onClose()
      }
    }, autoHideDuration)
    return () => clearTimeout(timer)
  }, [open])
  return (
    <>
      {visible && (
        <StyledSnackbar leftAlignFrom={leftAlignFrom} className={className}>
          {children}
        </StyledSnackbar>
      )}
    </>
  )
}

Snackbar.displayName = 'eds-snackbar'

Snackbar.propTypes = {
  /** Controls the visibility of the snackbar */
  open: PropTypes.bool,
  /** How long will the message be visible in milliseconds */
  autoHideDuration: PropTypes.number,
  /** @ignore */
  children: PropTypes.node.isRequired,
  /** @ignore */
  className: PropTypes.string,
  /** Callback fired when the snackbar is closed by auto hide duration timeout */
  onClose: PropTypes.func,
  /** Media query from which the snackbar will be horizontal centered */
  leftAlignFrom: PropTypes.string,
}

Snackbar.defaultProps = {
  autoHideDuration: 7000,
  onClose: undefined,
  open: false,
  leftAlignFrom: '1200px',
  className: undefined,
}
