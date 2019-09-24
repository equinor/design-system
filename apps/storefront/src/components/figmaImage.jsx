import React from 'react'
import PropTypes from 'prop-types'
import { useStaticQuery, graphql } from 'gatsby'
import styled from 'styled-components'

const Container = styled.div`
  display: block;
  width: 100%;
  padding: 16px;
  margin-bottom: 24px;
  text-align: center;
  font-size: 18px;
  background-color: #ebebeb !important;
`

const Link = styled(Container)`
  cursor: pointer;
  &:hover {
    background-color: #e1e1e1 !important;
  }
`

const Image = styled.img`
  background: transparent !important;
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
    <Link as="a" href={url} target="_blank">
      <Image src={imageUrl} alt="Go to Figma" />
    </Link>
  ) : (
    <Container>Missing image</Container>
  )
}

Embed.propTypes = {
  /** Url to embed in iframe. Will manipulate www.figma.com urls into Figma Embed */
  url: PropTypes.string.isRequired,
}

export default Embed
