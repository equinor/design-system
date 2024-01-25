/* eslint-disable import/no-unresolved */
import { InlineImageFullWidth, InlineImageLeftAlign, InlineImageRightAlign } from '../../icons'
import { RadioIconSelector } from '../components'
import type { ImageWithAlt } from './imageWithAlt'

const imageAlignmentOptions = [
  { value: 'full', icon: InlineImageFullWidth },
  { value: 'left', icon: InlineImageLeftAlign },
  { value: 'right', icon: InlineImageRightAlign },
]

export type PositionedInlineImage = {
  _type: 'positionedInlineImage'
  image: ImageWithAlt
  caption?: string
  attribution?: string
  layout?: string
}

export default {
  name: 'positionedInlineImage',
  title: 'Image',
  type: 'object',
  fields: [
    {
      name: 'image',
      title: 'Image with alt',
      type: 'imageWithAlt',
    },
    {
      name: 'caption',
      title: 'Image caption',
      type: 'string',
    },
    {
      name: 'attribution',
      title: 'Credit',
      type: 'string',
    },
    {
      name: 'layout',
      title: 'Layout',
      type: 'string',
      components: {
        input: function ImagePosition({ onChange, value }: { onChange: any; value: string }) {
          return (
            <RadioIconSelector
              name="imageAlignmentSelector"
              options={imageAlignmentOptions}
              defaultValue="full"
              currentValue={value}
              onChange={onChange}
            />
          )
        },
      },
    },
  ],

  preview: {
    select: {
      imageUrl: 'image.asset.url',
      alt: 'image.alt',
      caption: 'caption',
    },
    prepare({ imageUrl, caption, alt }: { imageUrl: string; alt: string; caption: string }) {
      return {
        title: alt,
        subtitle: caption,
        media: <img src={imageUrl} alt={alt} style={{ height: '100%' }} />,
      }
    },
  },
}
