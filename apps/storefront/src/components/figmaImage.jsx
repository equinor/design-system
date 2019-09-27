/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react'
import PropTypes from 'prop-types'
import { useStaticQuery, graphql } from 'gatsby'
import styled from 'styled-components'
import figmaSvg from '../assets/figma.svg'
import externalLinkSvg from '../assets/external_link.svg'
// TODO ^Change these icons to use eds-icons when library is available
const Container = styled.div`
  display: block;
  width: 100%;
  padding: 16px;
  margin-bottom: 24px;
  font-size: 18px;
  background-color: #ebebeb !important;
`

const Link = styled.a`
  cursor: pointer;
`

const Image = styled.img`
  margin-left: 4px;
  background: transparent !important;
`

// .Main class is disrubting top margin on second img child
const Title = styled(Link)`
  padding: 4px;
  > * {
    margin-top: 0 !important;
    height: 18px;
    margin-right: 8px;
  }
  &:hover {
    border-bottom: 1px solid #000;
  }
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

  return (
    <Container>
      <Title href={url} target="_blank">
        <Image src={figmaSvg} alt="Figma" />
        <Image src={externalLinkSvg} alt="External link" />
      </Title>
      {imageUrl ? (
        <Image src={imageUrl} alt="" />
      ) : (
        <div>
          <Image as="span" role="img" aria-label="See no evil">
            🙈
          </Image>
          Ops! Can&apos;t find the image, but you could still try Figma.
        </div>
      )}
    </Container>
  )
}

Embed.propTypes = {
  /** Url to embed in iframe. Will manipulate www.figma.com urls into Figma Embed */
  url: PropTypes.string.isRequired,
}

export default Embed
