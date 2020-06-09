import React, { forwardRef, useState } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { breadcrumbs as tokens } from './Breadcrumbs.tokens'

export const Breadcrumbs = forwardRef(function Breadcrumbs(
  { className, children, ...rest },
  ref,
) {
  const props = {
    ...rest,
    className,
    ref,
  }

  return <div {...props}>{children}</div>
})

Breadcrumbs.displayName = 'eds-breadcrumbs'

Breadcrumbs.propTypes = {
  children: PropTypes.node.isRequired,
  /** @ignore */
  className: PropTypes.string,
}

Breadcrumbs.defaultProps = {
  className: '',
}
