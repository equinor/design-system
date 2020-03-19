import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { search as tokens } from './Search.tokens'
import { typographyTemplate } from '../_common/templates'
import { Icon } from '../Icon'
import { search } from '@equinor/eds-icons'

const icons = {
  search,
}

Icon.add(icons)

const { spacings } = tokens

const typeProps = ['text', 'search', 'password', 'email', 'number']

const Variation = ({ variant }) => {
  if (!variant) {
    return ``
  }

  const {
    focus: { border: focusBorderOutline },
    border: { outline: borderOutline, bottom: borderBottom },
  } = variant

  return css`
    border-bottom: ${borderBottom.width} solid ${borderBottom.color};
    outline: ${borderOutline.width} solid ${borderOutline.color};

    &:active,
    &:focus {
      outline-offset: 0;
      border-bottom: 1px solid transparent;
      outline: ${focusBorderOutline.width} solid ${focusBorderOutline.color};
    }

    &:disabled {
      cursor: not-allowed;
      border-bottom: 1px solid transparent;
      outline: none;

      &:focus,
      &:active {
        outline: none;
      }
    }
  `
}

const StyledSearch = styled.input`
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  border: none;
  appearance: none;

  background: ${tokens.background};
  padding-left: ${spacings.left};
  padding-right: ${spacings.right};
  padding-top: ${spacings.top};
  padding-bottom: ${spacings.bottom};

  ${typographyTemplate(tokens.typography)}
  color: ${tokens.color};

  ${Variation}
`

const Container = styled.div`
  position: relative;
`

const StyledIcon = styled(Icon)`
  position: absolute;
`

export const Search = React.forwardRef(function EdsSearch(
  { disabled, ...rest },
  ref,
) {
  const props = {
    ...rest,
    disabled,
    ref,
  }
  const iconProps = {
    disabled,
    name: 'search',
  }

  return (
    <Container>
      <StyledSearch {...props} />
      <StyledIcon {...iconProps} />
    </Container>
  )
})

Search.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** Input label */
  label: PropTypes.string,
  /** Placeholder */
  placeholder: PropTypes.string,
  /** Specifiec which type input is */
  type: PropTypes.oneOf(typeProps),
  /** Disabled state */
  disabled: PropTypes.bool,
}

Search.defaultProps = {
  className: '',
  label: '',
  placeholder: '',
  type: 'text',
  disabled: false,
}

Search.displayName = 'eds-search'

Search.constants = {
  types: typeProps,
}
