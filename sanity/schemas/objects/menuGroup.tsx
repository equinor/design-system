import { list } from '@equinor/eds-icons'
import { EdsIcon } from '../../icons'
import type { Rule } from 'sanity'
import type { MenuLink } from './menuLink'

export type MenuGroup = {
  _type: 'menuGroup'
  label?: string
  links?: MenuLink[]
}

export default {
  title: 'Menu group',
  name: 'menuGroup',
  type: 'object',
  fields: [
    {
      title: 'Group label',
      name: 'label',
      description: 'The label that appears above the links.',
      type: 'string',
    },
    {
      title: 'Links',
      name: 'links',
      description: 'The links that appear in the group.',
      type: 'array',
      of: [
        {
          type: 'menuLink',
        },
      ],
      validation: (Rule: Rule) => Rule.required().min(1),
    },
  ],
  preview: {
    select: {
      label: 'label',
      links: 'links',
    },
    prepare(selection: { label: string; links: MenuLink[] }) {
      const { label = 'Unlabeled group', links = [] } = selection
      return {
        title: label,
        subtitle: `Links: ${links.length}`,
        media: EdsIcon(list),
      }
    },
  },
}
