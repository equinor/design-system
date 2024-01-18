/* eslint-disable react/display-name */
import blocksToText from '../../helpers/blocksToText'
import { FullSizeImage, LeftAlignedImage, RightAlignedImage, SmallSizeImage } from '../../icons'
import { RadioIconSelector } from '../components'
import CompactBlockEditor from '../components/CompactBlockEditor'
import { configureBlockContent, configureTitleBlockContent } from '../editors'
import { validateCharCounterEditor } from '../validations/validateCharCounterEditor'

import type { PortableTextBlock, Reference, Rule, ValidationContext } from 'sanity'
import type { DownloadableImage } from './downloadableImage'
import type { DownloadableFile } from './files'
import type { ImageWithAlt } from './imageWithAlt'
import type { LinkSelector } from './linkSelector'
import type { ColorSelectorValue } from '../components/ColorSelector'

const titleContentType = configureTitleBlockContent()

const imageSizeOptions = [
  { value: 'full', icon: FullSizeImage },
  { value: 'small', icon: SmallSizeImage },
]

const imageAlignmentOptions = [
  { value: 'left', icon: LeftAlignedImage },
  { value: 'right', icon: RightAlignedImage },
]

const blockConfig = {
  h1: false,
  h2: false,
  h3: false,
  h4: false,
  internalLink: false,
  externalLink: false,
  attachment: false,
  lists: true,
}

const blockContentType = configureBlockContent({ ...blockConfig })

const blockContentTypeForBigText = configureBlockContent({
  ...blockConfig,
  smallText: false,
  normalTextOverride: {
    title: 'Normal',
    value: 'normal',
    component: ({ children }: { children: React.ReactNode }) => <span style={{ fontSize: '42px' }}>{children}</span>,
  },
})

export type Teaser = {
  _type: 'teaser'
  overline?: string
  title?: PortableTextBlock[]
  text?: PortableTextBlock[]
  isBigText?: boolean
  bigText?: PortableTextBlock[]
  action?: (LinkSelector | DownloadableFile | DownloadableImage)[]
  image: ImageWithAlt
  imagePosition?: string
  imageSize?: string
  background?: ColorSelectorValue
}

type TeaserDocument = {
  parent: Teaser
}

export default {
  name: 'teaser',
  title: 'Teaser',
  type: 'object',
  localize: true,
  fieldsets: [
    {
      title: 'Eyebrow headline',
      name: 'eyebrow',
      description: 'A descriptive keyword, category or phrase that appears over the main headline.',
      options: {
        collapsible: true,
        collapsed: true,
      },
      hidden: ({ parent }: TeaserDocument) => parent.isBigText,
    },
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
      title: 'Big text',
      name: 'isBigText',
      type: 'boolean',
    },
    {
      name: 'overline',
      title: 'Eyebrow',
      type: 'string',
      fieldset: 'eyebrow',
    },
    {
      name: 'title',
      type: 'array',
      components: {
        input: CompactBlockEditor,
      },
      of: [titleContentType],
      hidden: ({ parent }: TeaserDocument) => parent.isBigText,
    },
    {
      name: 'text',
      title: 'Text content',
      type: 'array',
      of: [blockContentType],
      validation: (Rule: Rule) =>
        Rule.custom((value: PortableTextBlock[], ctx: ValidationContext) => {
          if (!(ctx.parent as Teaser)?.isBigText) {
            return validateCharCounterEditor(value, 600)
          }
          return true
        }).warning(),
      hidden: ({ parent }: TeaserDocument) => parent.isBigText,
    },
    {
      name: 'bigText',
      title: 'Text content',
      type: 'array',
      of: [blockContentTypeForBigText],
      validation: (Rule: Rule) =>
        Rule.custom((value: PortableTextBlock[], ctx: ValidationContext) => {
          if ((ctx.parent as Teaser)?.isBigText) {
            return validateCharCounterEditor(value, 600)
          }
          return true
        }),
      hidden: ({ parent }: TeaserDocument) => !parent.isBigText,
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
      description: 'Select which side of the teaser the image should be displayed at on larger screens.',
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
      name: 'imageSize',
      title: 'Image size',
      description: 'Select whether the image should be full size or have padding around it (SVG only)',
      type: 'string',
      fieldset: 'design',
      components: {
        input: function ({ onChange, value }: { onChange: any; value: string }) {
          return (
            <RadioIconSelector
              name="imageSizeSelector"
              options={imageSizeOptions}
              defaultValue="full"
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
      text: 'text',
      isBigText: 'isBigText',
      bigText: 'bigText',
      image: 'image.asset',
    },
    prepare({
      title,
      text,
      isBigText,
      bigText,
      image,
    }: {
      title: PortableTextBlock[]
      text: PortableTextBlock[]
      isBigText: boolean
      bigText: PortableTextBlock[]
      image: Reference
    }) {
      const plainTitle = isBigText ? blocksToText(bigText) : blocksToText(title || text)

      return {
        title: plainTitle || 'Missing title/content',
        subtitle: isBigText ? 'Teaser component (BIG TEXT)' : 'Teaser component',
        media: image,
      }
    },
  },
}
