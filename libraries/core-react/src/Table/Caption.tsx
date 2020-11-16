import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledCaption = styled.caption(({ captionSide }) => ({ captionSide }))

export const Caption = (props) => {
  return <StyledCaption {...props} />
}

Caption.propTypes = {
  captionSide: PropTypes.oneOf(['left', 'top', 'right', 'bottom']),
}

Caption.defaultProps = {
  captionSide: 'top',
}
