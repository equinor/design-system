import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { useStaticQuery, graphql } from 'gatsby'

const Container = styled.div`
  display: block;
  width: 100%;
  padding: 16px;
  margin-bottom: 24px;
  font-size: 18px;
  background-color: #ebebeb !important;
`

const VideoBase = styled.video`
  height: 450px;
  width: 800px;
  border: none;
  background-color: #2c2c2c;
`

const Video = ({ url, ...other }) => {
  // StaticQuery does not support grapql queries so we have to for all videos and then find it....
  const data = useStaticQuery(graphql`
    {
      allFile(filter: { relativeDirectory: { regex: "/video/" } }) {
        edges {
          node {
            publicURL
            relativePath
          }
        }
      }
    }
  `)

  let videoUrl = url

  if (url.startsWith('video') && data.allFile.edges.length > 0) {
    const video = data.allFile.edges.find(
      ({ node }) => node.relativePath === url,
    )
    videoUrl = video ? video.node.publicURL : undefined
  }

  return videoUrl ? (
    <VideoBase {...other} src={videoUrl} />
  ) : (
    <Container>
      Ops! Can&apos;t find the video, please check if your link is correct 🎥
      {url}
    </Container>
  )
}

Video.propTypes = {
  /** Url to embed in iframe. Will manipulate www.figma.com urls into Figma Embed */
  url: PropTypes.string.isRequired,
}

export default Video
