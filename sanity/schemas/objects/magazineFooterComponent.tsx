/* eslint-disable react/display-name */
import blocksToText from '../../helpers/blocksToText'
import { LeftAlignedImage, RightAlignedImage } from '../../icons'
import { RadioIconSelector } from '../components'
import CompactBlockEditor from '../components/CompactBlockEditor'
import { configureBlockContent, configureTitleBlockContent } from '../editors'
import { validateCharCounterEditor } from '../validations/validateCharCounterEditor'
import type { PortableTextBlock, Reference, Rule } from 'sanity'
import type { ColorSelectorValue } from '../components/ColorSelector'
import type { DownloadableImage } from './downloadableImage'
import type { DownloadableFile } from './files'
import type { ImageWithAlt } from './imageWithAlt'
import type { LinkSelector } from './linkSelector'

const titleContentType = configureTitleBlockContent()

const imageAlignmentOptions = [
  { value: 'left', icon: LeftAlignedImage },
  { value: 'right', icon: RightAlignedImage },
]

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

export type Teaser = {
  _type: 'teaser'
  title?: PortableTextBlock[]
  text?: PortableTextBlock[]
  action?: (LinkSelector | DownloadableFile | DownloadableImage)[]
  image: ImageWithAlt
  imagePosition?: string
  background?: ColorSelectorValue
}

export default {
  name: 'footerComponent',
  title: 'Footer component',
  description:
    'This component will display at the bottom of each magazine article as well as on the magazine landing page.',
  type: 'object',
  localize: true,
  fieldsets: [
    {
      name: 'link',
      title: 'Link',
      description: 'Select either an internal link or external URL.',
    },
    {
      name: 'design',
      title: 'Design options',
    },
  ],
  fields: [
    {
      name: 'title',
      type: 'array',
      components: {
        input: CompactBlockEditor,
      },
      of: [titleContentType],
    },
    {
      name: 'text',
      title: 'Text content',
      type: 'array',
      of: [blockContentType],
      validation: (Rule: Rule) =>
        Rule.custom((value: PortableTextBlock[]) => validateCharCounterEditor(value, 600)).warning(),
    },
    {
      name: 'action',
      title: 'Link/action',
      description: 'Select the link or downloadable file for the teaser',
      type: 'array',
      of: [
        { type: 'linkSelector', title: 'Link' },
        { type: 'downloadableImage', title: 'Downloadable image' },
        { type: 'downloadableFile', title: 'Downloadable file' },
      ],
      validation: (Rule: Rule) => Rule.max(1).error('Only one action is permitted'),
    },
    {
      name: 'image',
      title: 'Image',
      type: 'imageWithAlt',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'imagePosition',
      title: 'Image position',
      description: 'Select which side the image should be displayed at on larger screens.',
      type: 'string',
      fieldset: 'design',
      components: {
        input: function ({ onChange, value }: { onChange: any; value: string }) {
          return (
            <RadioIconSelector
              name="imageAlignmentSelector"
              options={imageAlignmentOptions}
              defaultValue="left"
              currentValue={value}
              onChange={onChange}
            />
          )
        },
      },
    },
    {
      title: 'Background',
      description: 'Pick a colour for the background. Default is white.',
      name: 'background',
      type: 'colorlist',
      fieldset: 'design',
    },
  ],
  preview: {
    select: {
      title: 'title',
      image: 'image.asset',
    },
    prepare({ title, image }: { title: PortableTextBlock[]; image: Reference }) {
      const plainTitle = title ? blocksToText(title) : undefined

      return {
        title: plainTitle || 'Missing title!',
        subtitle: 'Teaser component',
        media: image,
      }
    },
  },
}
