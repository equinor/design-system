import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

const Iframe = styled.iframe`
  height: 450px;
  width: 800px;
  border: none;
  background-color: #2c2c2c;
`

const parseUrl = (url) =>
  /www.figma.com/.test(url)
    ? `https://www.figma.com/embed?embed_host=astra&url=${url}`
    : url

const Embed = ({ url }) => <Iframe allowfullscreen src={parseUrl(url)} />

Embed.propTypes = {
  /** Url to embed in iframe. Will manipulate www.figma.com urls into Figma Embed */
  url: PropTypes.string.isRequired,
}

export default Embed // eslint-disable-line
