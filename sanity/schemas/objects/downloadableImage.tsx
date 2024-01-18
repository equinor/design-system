import type { Rule, Reference } from 'sanity'

export type DownloadableImage = {
  _type: 'downloadableImage'
  label: string
  image: Reference
}

export default {
  type: 'object',
  name: 'downloadableImage',
  title: 'Image',
  fields: [
    {
      name: 'label',
      type: 'string',
      title: 'Label',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'image',
      type: 'image',
      title: 'Image',
      validation: (Rule: Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'label',
      image: 'image',
    },
    prepare({ title = '', image }: { title: string; image: Reference }) {
      return {
        title,
        media: image,
        subtitle: 'Image',
      }
    },
  },
}
