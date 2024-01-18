import type { Rule, ValidationContext, CustomValidatorResult, Reference } from 'sanity'

export type ImageWithAlt = {
  _type: string
  asset: Reference
  isDecorative?: boolean
  alt?: string
}

export default {
  name: 'imageWithAlt',
  title: 'Image',
  type: 'image',
  options: {
    hotspot: true,
    collapsed: false,
  },
  fields: [
    {
      name: 'isDecorative',
      type: 'boolean',
      title: 'Image is decorative',
      description:
        'If this image is purely decorative you can disable the alt tag input here. Please note that this makes the image invisible for screen reader users.',
      initialValue: false,
    },
    {
      name: 'alt',
      type: 'string',
      title: 'Alt text',
      description: 'Alt attribute text description for image',
      validation: (Rule: Rule) =>
        Rule.custom((value: string, context: ValidationContext): CustomValidatorResult => {
          const { parent } = context as { parent: ImageWithAlt }

          // Only  make the alt tag required if an image has been selected
          if (!parent?.asset) return true

          // Alt tag should only be required if the image is not decorative
          if (!parent?.isDecorative && !value) {
            return 'Alt attribute is required'
          }

          return true
        }),
      hidden: ({ parent }: { parent: ImageWithAlt }) => parent?.isDecorative === true,
    },
  ],
}
