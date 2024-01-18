import { EdsIcon } from '../../icons'
import { play_circle } from '@equinor/eds-icons'
import blocksToText from '../../helpers/blocksToText'
import type { Reference, Rule, PortableTextBlock } from 'sanity'
import { title } from './iframe/sharedIframeFields'
import { configureTitleBlockContent } from '../editors'
import CompactBlockEditor from '../components/CompactBlockEditor'
import { defaultColors } from '../components/ColorSelector'

const titleContentType = configureTitleBlockContent()

export default {
  name: 'videoPlayerCarousel',
  title: 'Horizontal scroll video player',
  type: 'object',
  fieldsets: [
    {
      title: 'Design options',
      name: 'design',
      description: 'Some options for design',
      options: {
        collapsible: true,
        collapsed: false,
      },
    },
  ],
  fields: [
    title,
    {
      type: 'array',
      name: 'items',
      description: 'Add more videos',
      title: 'Scrollable video items',
      of: [
        {
          title: 'Video item',
          type: 'object',
          fields: [
            {
              name: 'title',
              type: 'array',
              title: 'Title',
              description: 'The (optional) title/heading shown beneath the video.',
              components: { input: CompactBlockEditor },
              of: [titleContentType],
            },
            {
              name: 'videoFile',
              type: 'reference',
              title: 'Video',
              to: [{ type: 'videoFile' }],
              validation: (Rule: Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'videoFile.video.title',
              image: 'videoFile.thumbnail',
            },
            prepare({
              title = [],
              subtitle,
              image,
            }: {
              title: PortableTextBlock[]
              subtitle: string
              image: Reference
            }) {
              return {
                title: blocksToText(title),
                subtitle: subtitle,
                media: image,
              }
            },
          },
        },
      ],
      validation: (Rule: Rule) => Rule.required().min(2),
    },
    {
      name: 'aspectRatio',
      type: 'string',
      title: 'Aspect ratio',
      options: {
        list: [
          { title: '16:9', value: '16:9' },
          { title: '9:16', value: '9:16' },
          { title: '1:1', value: '1:1' },
        ],
        layout: 'dropdown',
      },
      initialValue: '16:9',
      fieldset: 'design',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      title: 'Background',
      description: 'Pick a colour for the background. Default is white.',
      name: 'background',
      type: 'colorlist',
      fieldset: 'design',
      initialValue: defaultColors[0],
    },
  ],
  preview: {
    select: {
      title: 'title',
      items: 'items',
    },
    prepare(selection: any) {
      const { title, items } = selection
      const length = items ? items.length : 0

      return {
        title: title ? blocksToText(title) : 'Untitled horizontal scroll video',
        subtitle: `Horizontal scroll video carousel with ${length} items`,
        media: EdsIcon(play_circle),
      }
    },
  },
}
