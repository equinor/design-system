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
  max-width: 45rem;
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
  max-width: 100%;
  overflow: hidden;
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
  // Can't use lookbehind because of Safari's lack of support
  //const fileId = (/(?<=file\/).*(?=\/)/.exec(url) || [])[0] || ''
  //const nodeId = ((/(?<=node-id=).*/.exec(url) || [])[0] || '').replace(
  //  '%3A',
  //  '_',
  //)
  const splitOnFile = url.split(/(file\/.*?\/)/)
  const fileId =
    splitOnFile && splitOnFile.length > 1 ? splitOnFile[1].split(/(\/)/)[2] : ''
  const splitOnNodeId = url.split(/(node-id=)/)
  const nodeId =
    splitOnNodeId && splitOnNodeId.length > 2
      ? splitOnNodeId[2].replace('%3A', '_')
      : ''

  if (!fileId || !nodeId) {
    return ''
  }

  return `${fileId}.${nodeId}`
}

const FigmaImage = ({ url, alt = 'Design in Figma' }) => {
  const data = useStaticQuery(graphql`
    {
      allFile(
        filter: {
          extension: { regex: "/(jpg)|(jpeg)|(png)/" }
          relativeDirectory: { regex: "/figma/" }
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
        <Image src={imageUrl} alt={alt} />
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

FigmaImage.propTypes = {
  /** Url to embed in iframe. Will manipulate www.figma.com urls into Figma Embed */
  url: PropTypes.string.isRequired,
  /** Alt text for the Figma image */
  alt: PropTypes.string, //eslint-disable-line
}

export default FigmaImage //eslint-disable-line
