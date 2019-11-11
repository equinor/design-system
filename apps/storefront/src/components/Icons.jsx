import React from 'react'
import styled from 'styled-components'
import fileDownload from 'js-file-download'
import systemIcons from '../assets/icons/system-icons.json'

const Container = styled.div`
  width: 100%;
`

const Title = styled.h2``

const Label = styled.p`
  text-align: center;
  margin: 4px;
`

const DownloadLabel = styled(Label)`
  padding: 8px;
  display: flex;
  align-items: center;
  visibility: hidden;
  &:hover {
    background: #efefef;
    cursor: pointer;
  }
`

const Group = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 16px;
`

const Image = styled.img`
  background: transparent !important;
  width: 48px;
`
const DownloadImage = styled(Image)`
  width: 24px;
`

const Icon = styled.div`
  display: flex;

  margin-right: 1.5em;
  margin-top: 1.5em;
  padding: 16px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 15%;

  &:hover {
    ${DownloadLabel} {
      visibility: visible !important;
    }
  }
`
const downloadIcon = systemIcons.find((x) => x.name === 'download')

const downloadAsSvg = (data, name) => fileDownload(data, `${name}.svg`)

const Icons = () => {
  const iconsByGroup = systemIcons.reduce((acc, val) => {
    const group = typeof acc[val.group] !== 'undefined' ? acc[val.group] : []
    return {
      ...acc,
      [val.group]: [...group, val],
    }
  }, {})
  return (
    <Container>
      {Object.keys(iconsByGroup).map((key) => {
        return (
          <Group key={key}>
            <Title>{key}</Title>
            <Group>
              {iconsByGroup[key].map((icon) => {
                const { name, datauri } = icon
                return (
                  <Icon key={name}>
                    <Image src={datauri} alt={name} />
                    <Label>{name}</Label>
                    <DownloadLabel
                      onClick={() => downloadAsSvg(icon.value, name)}
                    >
                      <DownloadImage
                        src={downloadIcon.datauri}
                        alt={`Download ${name} as SVG file`}
                      />
                      SVG
                    </DownloadLabel>
                  </Icon>
                )
              })}
            </Group>
          </Group>
        )
      })}
    </Container>
  )
}

Icons.propTypes = {
  /** Url to embed in iframe. Will manipulate www.figma.com urls into Figma Embed */
}

export default Icons
