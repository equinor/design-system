import React from 'react'
import styled from 'styled-components'
import { Button, Icon } from '@equinor/eds-core-react'
import { H2 } from './Titles'
import fileDownload from 'js-file-download'
import systemIcons from '../assets/icons/system-icons.json'

const Container = styled.div`
  width: 100%;
  max-width: 49rem;
`

const Label = styled.p`
  text-align: center;
  margin: 4px;
`

const DownloadLabel = styled(Button)`
  padding: 8px;
  display: flex;
  align-items: center;
  margin-top: 8px;
  /* &:focus {
    visibility: visible;
  } */
  &:not(:focus):not(:active) {
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 36px;
    overflow: hidden;
    /*  position: absolute; */
    white-space: nowrap;
    /*  width: 1px; */
  }
`

const Group = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  row-gap: 1rem;
  column-gap: 1rem;
  margin: 0;
  padding: 0;
`

const Image = styled.img`
  background: transparent !important;
  width: 48px;
`

const IconItem = styled.li`
  display: flex;
  padding: 16px 0;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  z-index: 10;
  &:hover {
    background-color: rgba(222, 237, 238, 0.3);
    border-radius: 4px;
    ${DownloadLabel} {
      clip: auto;
      clip-path: none;

      overflow: hidden;
      white-space: nowrap;
    }
  }
`

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
          <div key={key}>
            <H2>{key}</H2>
            <Group>
              {iconsByGroup[key].map((icon) => {
                const { name, datauri } = icon
                return (
                  <IconItem key={name}>
                    <Image src={datauri} alt={name} />
                    <Label>{name}</Label>
                    <DownloadLabel
                      variant="outlined"
                      onClick={() => downloadAsSvg(icon.value, name)}
                    >
                      <Icon name="download" aria-hidden title="download" />
                      SVG
                    </DownloadLabel>
                  </IconItem>
                )
              })}
            </Group>
          </div>
        )
      })}
    </Container>
  )
}

Icons.propTypes = {
  /** Url to embed in iframe. Will manipulate www.figma.com urls into Figma Embed */
}

export default Icons // eslint-disable-line
