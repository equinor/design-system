import { EdsIcon } from '../../icons'
import { tag } from '@equinor/eds-icons'
import type { Rule } from 'sanity'

export default {
  title: 'Asset tag',
  type: 'document',
  name: 'assetTag',
  icon: () => EdsIcon(tag),
  fields: [
    {
      title: 'Title',
      description: 'Name of the tag used for internal filtering.',
      name: 'title',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }: { title: string }) {
      return {
        title: title,
        subtitle: 'Asset file tag',
        media: EdsIcon(tag),
      }
    },
  },
}
