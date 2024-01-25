import { play_circle } from '@equinor/eds-icons'
import { EdsIcon } from '../../icons'

import { configureBlockContent, configureTitleBlockContent } from '../editors'
import CompactBlockEditor from '../components/CompactBlockEditor'
import blocksToText from '../../helpers/blocksToText'
import type { PortableTextBlock, Rule } from 'sanity'
import { ImageWithAlt } from './imageWithAlt'

const titleContentType = configureTitleBlockContent()

const ingressContentType = configureBlockContent({
  h1: false,
  h2: false,
  h3: false,
  h4: false,
  attachment: false,
})

export default {
  name: 'videoPlayer',
  title: 'Video Player',
  type: 'object',
  fields: [
    {
      name: 'title',
      type: 'array',
      title: 'Title',
      description: 'The (optional) title/heading shown above the video.',
      components: { input: CompactBlockEditor },
      of: [titleContentType],
    },
    {
      name: 'ingress',
      title: 'Ingress',
      type: 'array',
      of: [ingressContentType],
    },
    {
      name: 'action',
      title: 'Link/action',
      description: 'You can add one separate link if you need. The link will show up at the bottom of the component.',
      type: 'array',
      of: [{ type: 'linkSelector', title: 'Link' }],
      validation: (Rule: Rule) => Rule.max(1),
    },
    {
      name: 'videoFile',
      type: 'reference',
      title: 'Video',
      to: [{ type: 'videoFile' }],
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'videoControls',
      type: 'videoControls',
      title: 'Video Controls',
      options: {
        collapsible: true,
        collapsed: false,
      },
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
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'height',
      type: 'number',
      title: 'Height',
      description: 'Set a fixed height in pixels for the video. Note: this will override the aspect ratio setting.',
      validation: (Rule: Rule) => Rule.positive().greaterThan(0).precision(0),
    },

    {
      title: 'Background',
      description: 'Pick a colour for the background. Default is white.',
      name: 'background',
      type: 'colorlist',
    },
  ],
  preview: {
    select: {
      title: 'title',
      videoTitle: 'videoFile.video.title',
      media: 'videoFile.thumbnail',
    },
    prepare({ title, videoTitle, media }: { title: PortableTextBlock[]; videoTitle: string; media: ImageWithAlt }) {
      const plainTitle = title ? blocksToText(title) : undefined

      return {
        title: plainTitle || videoTitle,
        subtitle: `Video component`,
        media: media || EdsIcon(play_circle),
      }
    },
  },
}
