import { useState, useMemo } from 'react'
import { StoryFn, Meta } from '@storybook/react-vite'
import styled from 'styled-components'
import { Icon, Button, Typography, Search } from '../../src'
import { download, IconData } from '@equinor/eds-icons'
import fileDownload from 'js-file-download'
import systemIcons from '../assets/icons/system-icons.json'
// @ts-expect-error: MDX import for Storybook docs
import page from './IconPreview.docs.mdx'

const meta: Meta = {
  title: 'Icons/Preview',
  parameters: {
    docs: {
      page,
    },
    previewTabs: {
      canvas: { hidden: true },
    },
  },
}

export default meta

const IconLabel = styled(Typography)`
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
  padding-top: 24px;
  padding-bottom: 24px;
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

const StyledSearch = styled(Search)`
  margin-bottom: 32px;
  margin-top: 32px;
`

const downloadAsSvg = (data: string | Blob, name: string) =>
  fileDownload(data, `${name}.svg`)

type IconType = {
  value?: string
} & IconData

export const Preview: StoryFn = () => {
  const [searchValue, setSearchValue] = useState<string>('')

  const iconsByGroup = useMemo(() => {
    return systemIcons.reduce(
      (acc, val) => {
        if (val.name.includes(searchValue)) {
          const group =
            typeof acc[val.group] !== 'undefined' ? acc[val.group] : []
          return {
            ...acc,
            [val.group]: [...group, val as unknown as IconType],
          }
        } else {
          return acc
        }
      },
      {} as Record<string, IconType[]>,
    )
  }, [searchValue])

  return (
    <>
      <StyledSearch
        aria-label="Search for icons"
        id="search-normal"
        placeholder="Search"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setSearchValue(event.target.value)
        }
      />
      {Object.keys(iconsByGroup).map((key) => {
        return (
          <div key={key}>
            {/* Docs-blocks components (HeaderMdx) must not render in the
                canvas iframe — they read the Storybook manager theme, which
                is undefined here (crashed with Storybook 10.5, #5213). */}
            <Typography variant="h2" id={key}>
              {key}
            </Typography>
            <Group>
              {iconsByGroup[key].map((icon: IconType) => {
                const { name } = icon
                return (
                  <IconItem key={name}>
                    <Icon data={icon} />
                    <IconLabel>{name}</IconLabel>
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
          </div>
        )
      })}
    </>
  )
}
