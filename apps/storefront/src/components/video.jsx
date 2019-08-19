import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

const VideoBase = styled.video`
  height: 450px;
  width: 800px;
  border: none;
  background-color: #2c2c2c;
`

const Video = ({ url, ...other }) => <VideoBase {...other} src={url} />

Video.propTypes = {
  /** Url to embed in iframe. Will manipulate www.figma.com urls into Figma Embed */
  url: PropTypes.string.isRequired,
}

export default Video
