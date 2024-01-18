import type { Rule, Reference } from 'sanity'
import type { ImageWithAlt } from './imageWithAlt'

export type FullWidthImage = {
  _type: 'fullWidthImage'
  image: ImageWithAlt
}

export default {
  name: 'fullWidthImage',
  title: 'Full width image',
  type: 'object',
  fields: [
    {
      name: 'image',
      title: 'Image',
      type: 'imageWithAltAndCaption',
      validation: (Rule: Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      alt: 'image.alt',
      image: 'image.image.asset',
    },
    prepare({ alt, image }: { alt: string; image: Reference }) {
      const altText = alt === undefined ? 'Decorative image' : alt
      return {
        title: `Alt text: ${altText}`,
        subtitle: 'Full width image',
        media: image,
      }
    },
  },
}
