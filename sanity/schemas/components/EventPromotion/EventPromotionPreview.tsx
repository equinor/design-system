import { useEffect, useState } from 'react'
import { Badge, Flex, Box } from '@sanity/ui'
import type { PreviewProps, Reference } from 'sanity'
import { EdsIcon } from '../../../icons'
import { calendar_event } from '@equinor/eds-icons'

type EventPromotionPreviewProps = {
  tags?: string[]
  manuallySelectEvents?: boolean
  promotedEvents?: Reference[]
  promotePastEvents?: boolean
  pastEventsCount?: number
  useTags?: boolean
} & PreviewProps

export const EventPromotionPreview = (props: EventPromotionPreviewProps) => {
  const { manuallySelectEvents, promotedEvents, promotePastEvents, pastEventsCount, useTags, tags, renderDefault } =
    props
  const [title, setTitle] = useState('Event promotion')

  useEffect(() => {
    if (manuallySelectEvents && promotedEvents) {
      return setTitle(`Showing ${promotedEvents.length} selected events`)
    }

    const time = promotePastEvents ? 'past' : 'upcoming'
    const number = promotePastEvents ? pastEventsCount || '50 (max)' : ''
    const withTags = useTags && tags ? `from ${tags.length} tag(s)` : ''

    return setTitle(`Showing ${number} ${time} events ${withTags}`)
  }, [manuallySelectEvents, promotedEvents, useTags, tags, pastEventsCount])

  return (
    <Flex align="center">
      <Box flex={1}>
        {renderDefault({ ...props, title: title, subtitle: 'Event promotion', media: EdsIcon(calendar_event) })}
      </Box>

      {manuallySelectEvents ? (
        <Badge tone="caution" marginLeft={1}>
          Manual
        </Badge>
      ) : (
        <>
          <Badge tone="primary" marginLeft={1}>
            Automatic
          </Badge>
          {promotePastEvents && (
            <Badge tone="primary" marginLeft={1}>
              Past events
            </Badge>
          )}
        </>
      )}
    </Flex>
  )
}
