import PropTypes from 'prop-types'

/**
 * @typedef CommonProps
 * @prop {'left' | 'right'} [chevronPosition] Which side the chevron should be on
 * @prop {'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'} [headerLevel] The header level, i.e. h1, h2, h3 etc.
 */

export const commonPropTypes = {
  /** Which side the chevron should be on  */
  chevronPosition: PropTypes.oneOf(['left', 'right']),
  /** The header level, i.e. h1, h2, h3 etc. */
  headerLevel: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
  /** @ignore */
  className: PropTypes.string,
}

export const commonDefaultProps = {
  chevronPosition: 'left',
  headerLevel: 'h2',
  className: '',
}
