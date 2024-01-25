import { ReactNode, useState, useCallback, useRef, forwardRef, useEffect } from 'react'
import { MemberField, set, unset } from 'sanity'
import { createPortal } from 'react-dom'
import type { ObjectInputProps } from 'sanity'
import { Buffer } from 'buffer'
import { UploadIcon, ResetIcon, EllipsisVerticalIcon, ComponentIcon } from '@sanity/icons'
import { Button, Dialog, Text, Label, Menu, MenuButton, MenuDivider, MenuItem, Stack, Card, Box } from '@sanity/ui'
import HLSPlayer from './HLSPlayer'
import { baseUrl } from '../../resolveProductionUrl'
import { getObjectMemberField } from './utils/getObjectMemberField'

type VideoSelector = {
  id: string
  title: string
  url: string
}

type VideoSelectorProps = {
  value?: VideoSelector
  children?: ReactNode
} & ObjectInputProps

const MEDIABANK_DOMAIN = 'https://communicationtoolbox.equinor.com'
const MEDIABANK_URL =
  MEDIABANK_DOMAIN +
  '/dam2/archive?p_com_id=12366&p_oty_id=146867&p_ptl_id=16613&p_lae_id=2&p_mode=plugin_object&p_filter=status:1;sort:obt_id%20desc;type:AND;viewers:VIDEO_VIEWER;localCategories:822833'
const MEDIABANK_IMPORT_TYPE = 'dam:assets-imported'

const SCREEN9_ACCOUNT_ID = process.env.SANITY_STUDIO_SCREEN9_ACCOUNT_ID
const SCREEN9_TOKEN = process.env.SANITY_STUDIO_SCREEN9_TOKEN
const SCREEN9_AUTH = Buffer.from(`${SCREEN9_ACCOUNT_ID}:${SCREEN9_TOKEN}`).toString('base64')

const VideoSelector = forwardRef(function VideoSelector(
  props: VideoSelectorProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null)
  const [error, setError] = useState('')
  const { value, members, children, renderField, renderInput, renderItem, renderPreview, onChange } = props

  useEffect(() => {
    setContainer(document.createElement('div'))
  }, [])

  const closeModal = () => {
    newWindow?.current?.close()
    window.removeEventListener('message', handleMediaBankEvent)
  }

  const handleMediaBankEvent = useCallback(
    async (event: MessageEvent) => {
      if (!event || !event.data || event.origin !== MEDIABANK_DOMAIN) return false

      const message = JSON.parse(event.data)

      if (message?.type === MEDIABANK_IMPORT_TYPE) {
        const file = message.data.assets[0]

        if (file.viewer === 'VIDEO_VIEWER' && file.screen9Connected) {
          const videoId = file.flvVideoRef
          const endpoint = `${baseUrl}/api/screen9/${SCREEN9_ACCOUNT_ID}/videos/${videoId}/streams?ssl=true`

          const data = await fetch(endpoint, {
            headers: {
              Authorization: `Basic ${SCREEN9_AUTH}`,
            },
          })
            .then((res) =>
              res.status !== 200
                ? setError('Could not retrieve url from Screen9. Please report the error to the dev team.')
                : res.json(),
            )
            .catch((error) => {
              setError(`Could not retrieve url from Screen9. Please report the error to the dev team. Error: ${error}`)
            })

          if (!data.error) {
            const video = {
              id: videoId,
              title: file.title,
              url: data.streams.hls,
            }
            // save to document
            onChange(set(video))
          }
        } else {
          setError('File is not supported. Please select a equinor.com video file.')
        }
        closeModal()
      }
    },
    [onChange],
  )

  const handleOpenModal = () => {
    const height = 800
    const width = 1200

    const left = window.screen.width / 2 - width / 2
    const top = window.screen.height / 2 - height / 2

    if (container) {
      newWindow.current = window.open(
        MEDIABANK_URL,
        'Media Bank',
        `height=${height},width=${width},left=${left},top=${top}`,
      )

      if (newWindow.current) {
        newWindow.current.document.body.appendChild(container)
        window.addEventListener('message', handleMediaBankEvent)
      }
    }
  }

  const handleReset = () => {
    onChange(unset())
  }

  const newWindow = useRef<Window | null>(null)

  const title = getObjectMemberField(members, 'title')

  useEffect(() => {
    // Clean up event listener when unmounting component
    return () => {
      window.removeEventListener('message', handleMediaBankEvent)
    }
  }, [handleMediaBankEvent])

  return (
    <>
      {container && createPortal(children, container)}
      {error && (
        <Dialog id="error-dialog" header={'Error'} onClose={() => setError('')}>
          <Box padding={4}>
            <Text>{error}</Text>
          </Box>
        </Dialog>
      )}
      {!value ? (
        <Stack>
          <Button
            icon={UploadIcon}
            mode="ghost"
            type="button"
            onClick={handleOpenModal}
            text="Import from Media Bank"
          />
        </Stack>
      ) : (
        <Stack space={4} marginTop={2}>
          <Stack space={3}>
            <Label as="label" htmlFor="text-input" size={1}>
              Title
            </Label>
            {title && (
              <MemberField
                member={title}
                renderInput={renderInput}
                renderField={renderField}
                renderItem={renderItem}
                renderPreview={renderPreview}
              />
            )}
          </Stack>
          <Stack space={3}>
            <Label as="label" htmlFor="asset" size={1}>
              Asset
            </Label>
            <div ref={forwardedRef} id="asset" style={{ position: 'relative' }}>
              <Card border paddingX={6} tone="transparent">
                <HLSPlayer
                  src={value.url}
                  controls={true}
                  width="100%"
                  height="350px"
                  style={{ marginBottom: '-5px', background: 'black' }}
                />
              </Card>

              <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
                <MenuButton
                  button={<Button icon={EllipsisVerticalIcon} mode="ghost" />}
                  id="menu-video"
                  menu={
                    <Menu>
                      <MenuItem as="div">
                        <Label size={2}>Replace</Label>
                      </MenuItem>
                      <MenuItem
                        as="button"
                        icon={ComponentIcon}
                        type="button"
                        onClick={handleOpenModal}
                        text="Media Bank"
                      />
                      <MenuDivider />
                      <MenuItem as="button" icon={ResetIcon} text="Clear field" tone="critical" onClick={handleReset} />
                    </Menu>
                  }
                  popover={{ portal: true }}
                />
              </div>
            </div>
          </Stack>
        </Stack>
      )}
    </>
  )
})

export default VideoSelector
