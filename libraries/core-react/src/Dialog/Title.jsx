import React, { forwardRef, Fragment } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Divider } from '@equinor/eds-core-react'
import { spacingsTemplate, typographyTemplate } from '../_common/templates'
import { dialog as tokens } from './Dialog.tokens'

const {
  title: { text },
  spacings,
} = tokens

const StyledTitle = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: auto auto;
  grid-gap: 24px;

  ${spacingsTemplate(spacings)};
  ${typographyTemplate(text)}
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
      <Divider color="medium" variant="small" />
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
