import type { Reference, Rule } from 'sanity'
import type { ColorSelectorValue } from '../components/ColorSelector'
import type { ImageWithAltAndCaption } from './imageWithAltAndCaption'

export type Figure = {
  _type: 'figure'
  figure: ImageWithAltAndCaption
  background?: ColorSelectorValue
}

export default {
  name: 'figure',
  title: 'Image',
  type: 'object',
  description: 'Image with optional caption and credit.',

  fieldsets: [
    {
      name: 'design',
      title: 'Design options',
    },
  ],
  fields: [
    {
      name: 'figure',
      title: 'Image',
      type: 'imageWithAltAndCaption',
      validation: (Rule: Rule) => Rule.required(),
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
      alt: 'figure.image.alt',
      image: 'figure.image.asset',
    },
    prepare({ alt, image }: { alt: string; image: Reference }) {
      const altText = alt === undefined ? 'Decorative image' : alt
      return {
        title: `Alt text: ${altText}`,
        subtitle: 'Image',
        media: image,
      }
    },
  },
}
