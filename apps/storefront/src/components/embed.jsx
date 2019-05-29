import PropTypes from 'prop-types'
import React from 'react'

const embed = (url) =>
  /www.figma.com/.test(url)
    ? `https://www.figma.com/embed?embed_host=astra&url=${url}`
    : url

const Embed = ({ url }) => (
  <iframe height="720px" width="1280px" src={embed(url)} />
)

Embed.propTypes = {
  url: PropTypes.string,
}

Embed.defaultProps = {
  url: '',
}

export default Embed
