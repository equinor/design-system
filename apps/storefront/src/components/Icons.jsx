import React from 'react'
import styled from 'styled-components'
import fileDownload from 'js-file-download'
import systemIcons from '../assets/icons/system-icons.json'

const Container = styled.div`
  width: 100%;
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
    background: #efefef;
    cursor: pointer;
  }
`

const Title = styled.h2``

const Label = styled.p`
  text-align: center;
  margin: 4px;
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
          <Group>
            <Title>{key}</Title>
            <Group>
              {iconsByGroup[key].map((icon) => {
                const fixedName = icon.name.replace('_', ' ')
                return (
                  <Icon onClick={() => downloadAsSvg(icon.value, fixedName)}>
                    <Image src={icon.datauri} alt={fixedName} />
                    <Label>{fixedName}</Label>
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
