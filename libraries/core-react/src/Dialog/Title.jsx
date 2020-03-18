import React, { forwardRef, Fragment } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { Divider } from '../Divider'
import { spacingsTemplate, typographyTemplate } from '../_common/templates'
import { dialog as tokens } from './Dialog.tokens'

const {
  title: { text },
  spacingsTitle,
} = tokens

const StyledTitle = styled.div`
  display: grid;
  justify-self: start;
  min-height: 24px;

  ${spacingsTemplate(spacingsTitle)};
  ${typographyTemplate(text)}

  ${({ children }) =>
    !children &&
    css`
      min-height: initial;
      height: 8px;
    `}
`

export const Title = forwardRef(function EdsDialogTitle(
  { children, ...props },
  ref,
) {
  return (
    <Fragment>
      <StyledTitle id="eds-dialog-title" ref={ref} {...props}>
        {children}
      </StyledTitle>
      {children && <Divider color="medium" variant="small" />}
    </Fragment>
  )
})

Title.displayName = 'eds-dialog-title'

Title.propTypes = {
  /** @ignore */
  children: PropTypes.node,
  /** @ignore */
  className: PropTypes.string,
}

Title.defaultProps = {
  className: undefined,
  children: undefined,
}
