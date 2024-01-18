import { puzzle_filled } from '@equinor/eds-icons'
import blocksToText from '../../helpers/blocksToText'
import { EdsIcon } from '../../icons'
import { configureBlockContent } from '../editors/blockContentType'

const blockContentType = configureBlockContent({
  h1: false,
  h2: false,
  h3: false,
  h4: false,
  internalLink: false,
  externalLink: false,
  attachment: false,
  lists: false,
})

export default {
  title: 'Short text with icon',
  name: 'textWithIcon',
  type: 'object',
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
    },
    {
      name: 'text',
      title: 'Text',
      type: 'array',
      of: [blockContentType],
    },

    {
      title: 'Icon',
      name: 'icon',
      type: 'imageWithAlt',
      options: {
        accept: 'image/svg+xml',
        hotspot: false,
      },
    },
  ],
  preview: {
    select: {
      title: `title`,
      text: `text`,
      icon: 'icon',
    },
    prepare({ title = '', text = null, icon }: { title: string; text: any; icon: any }) {
      return {
        title: text ? blocksToText(text) : title || 'Missing content',
        subtitle: 'Text with icon component',
        media: icon?.asset || <div>{EdsIcon(puzzle_filled)}</div>,
      }
    },
  },
}
