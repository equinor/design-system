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

const ImageBase = styled.img`
  width: 100%;
  border: none;
  background-color: #2c2c2c;
`

const Image = ({ url = '', ...other }) => {
  // StaticQuery does not support grapql queries so we have to for all videos and then find it....
  const data = useStaticQuery(graphql`
    {
      allFile(filter: { relativeDirectory: { regex: "/images/" } }) {
        edges {
          node {
            publicURL
            relativePath
          }
        }
      }
    }
  `)

  let imageUrl = url

  if (url.startsWith('images') && data.allFile.edges.length > 0) {
    const src = decodeURI(url).toLowerCase()
    const image = data.allFile.edges.find(
      ({ node }) => node.relativePath.toLowerCase() === src,
    )
    imageUrl = image ? image.node.publicURL : undefined
  }

  return imageUrl ? (
    <ImageBase {...other} src={imageUrl} />
  ) : (
    <Container>
      Ops! Can&apos;t find the image, please check if your link is correct
      <span role="img" aria-label="photo">
        🏞️
      </span>
      {url}
    </Container>
  )
}

Image.propTypes = {
  /** Url to embed in iframe. Will manipulate www.figma.com urls into Figma Embed */
  url: PropTypes.string.isRequired,
}

export default Image
