import React from 'react'
import PropTypes from 'prop-types'
import { useStaticQuery, graphql } from 'gatsby'
import styled from 'styled-components'

const Image = styled.img`
  width: 800px;
  border: none;
  background-color: #ebebeb !important;
  padding: 16px;
`
const MissingImage = styled(Image)`
  text-align: center;
  vertical-align: center;
  font-size: 18px;
`

const parseUrl = (url) => {
  const fileId = (/(?<=file\/).*(?=\/)/.exec(url) || [])[0] || ''
  const nodeId = ((/(?<=node-id=).*/.exec(url) || [])[0] || '').replace(
    '%3A',
    '_',
  )

  if (!fileId || !nodeId) {
    return ''
  }

  return `${fileId}.${nodeId}`
}

const Embed = ({ url }) => {
  const data = useStaticQuery(graphql`
    {
      allFile(
        filter: {
          extension: { regex: "/(jpg)|(jpeg)|(png)/" }
          relativeDirectory: { eq: "figma" }
        }
      ) {
        edges {
          node {
            publicURL
            name
          }
        }
      }
    }
  `)
  const imageName = parseUrl(url)
  const image = data.allFile.edges.find((x) => x.node.name === imageName)
  const imageUrl = image ? image.node.publicURL : ''

  return imageUrl ? (
    <Image src={imageUrl} />
  ) : (
    <MissingImage as="div">Missing image</MissingImage>
  )
}

Embed.propTypes = {
  /** Url to embed in iframe. Will manipulate www.figma.com urls into Figma Embed */
  url: PropTypes.string.isRequired,
}

export default Embed
