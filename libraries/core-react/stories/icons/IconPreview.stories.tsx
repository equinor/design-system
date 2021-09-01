import { Story, Meta } from '@storybook/react'
import styled from 'styled-components'
import { Icon, Button, Typography, TableOfContents } from '../../src'
import fileDownload from 'js-file-download'
import systemIcons from '../assets/icons/system-icons.json'

import { download } from '@equinor/eds-icons'

export default {
  title: 'Icons',
  parameters: {
    viewMode: 'canvas',
  },
} as Meta

const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: auto 14rem;
`

const Label = styled(Typography)`
  text-align: center;
  margin: 4px;
`

const DownloadLabel = styled(Button)`
  margin-top: 8px;
  &:not(:focus):not(:active) {
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 36px;
    overflow: hidden;
    white-space: nowrap;
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

const downloadAsSvg = (data: string | Blob, name: string) =>
  fileDownload(data, `${name}.svg`)

export const Preview: Story = () => {
  const iconsByGroup = systemIcons.reduce((acc, val) => {
    const group = typeof acc[val.group] !== 'undefined' ? acc[val.group] : []
    return {
      ...acc,
      [val.group]: [...group, val],
    }
  }, {} as Record<string, string>)

  return (
    <Wrapper>
      <main>
        {Object.keys(iconsByGroup).map((key) => {
          return (
            <article key={key}>
              <Typography variant="h2" id={key}>
                {key}
              </Typography>
              <Group>
                {(iconsByGroup[key] as [Record<string, string>]).map((icon) => {
                  const { name, datauri } = icon
                  return (
                    <IconItem key={name}>
                      <Image src={datauri} alt={name} />
                      <Label>{name}</Label>
                      <DownloadLabel
                        variant="outlined"
                        onClick={() => downloadAsSvg(icon.value, name)}
                      >
                        <Icon data={download} />
                        SVG
                      </DownloadLabel>
                    </IconItem>
                  )
                })}
              </Group>
            </article>
          )
        })}
      </main>
      <aside>
        <TableOfContents sticky>
          {Object.keys(iconsByGroup).map((item) => (
            <TableOfContents.LinkItem key={item} title={item}>
              <Typography href={`#` + item} link variant="body_short">
                <Icon name="subdirectory_arrow_right" size={16} />
                <span>{item}</span>
              </Typography>
            </TableOfContents.LinkItem>
          ))}
        </TableOfContents>
      </aside>
    </Wrapper>
  )
}
