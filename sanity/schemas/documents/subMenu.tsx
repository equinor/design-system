import { format_line_spacing, playlist_add } from '@equinor/eds-icons'
import { EdsIcon } from '../../icons'
import { configureBlockContent } from '../editors/blockContentType'
import { validateInternalOrExternalUrl } from '../validations/validateInternalOrExternalUrl'
import { validateCharCounterEditor } from '../validations/validateCharCounterEditor'

import type { Rule, ValidationContext, Reference } from 'sanity'
import routes from '../routes'
import { filterByRoute, filterByRouteNewsMagazineAndTitle } from '../../helpers/referenceFilters'
import { Flags } from '../../src/lib/datasetHelpers'

export type SubMenu = {
  _type: 'subMenu'
  label: string
  isDisabled: boolean
  intro: any
  group?: any
  url?: string
  reference?: Reference
  featuredContent?: Reference
}

const introBlockContentType = configureBlockContent({
  h1: false,
  h2: false,
  h3: false,
  h4: false,
  internalLink: false,
  externalLink: false,
  attachment: false,
  lists: false,
})

export default {
  type: 'document',
  name: 'subMenu',
  title: 'Menu item',
  icon: () => EdsIcon(playlist_add),
  fieldsets: [
    {
      title: 'Top level/landing page link',
      name: 'link',
      options: {
        collapsible: true,
        collapsed: false,
      },
    },
  ],
  fields: [
    {
      title: 'Menu label',
      name: 'label',
      description: 'The label that appears at top level in the menu',
      type: 'string',
    },
    {
      name: 'reference',
      title: 'Internal link',
      description: 'Use this field to reference an internal page.',
      type: 'reference',
      fieldset: 'link',
      validation: (Rule: Rule) =>
        Rule.custom((value: any, context: ValidationContext) => {
          const { parent } = context as { parent: SubMenu }
          return validateInternalOrExternalUrl(value, parent.url)
        }),
      to: routes,
      options: {
        filter: filterByRoute,
        disableNew: true,
      },
    },
    {
      name: 'url',
      title: 'External URL',
      description: 'Use this field to link to an external site.',
      type: 'url',
      fieldset: 'link',
      validation: (Rule: Rule) =>
        Rule.custom((value: any, context: ValidationContext) => {
          const { parent } = context as { parent: SubMenu }
          return validateInternalOrExternalUrl(value, parent.reference)
        }),
    },
    {
      title: 'Menu groups',
      name: 'group',
      type: 'array',
      of: [
        {
          type: 'menuGroup',
        },
      ],
      validation: (Rule: Rule) => Rule.max(5),
    },
    {
      name: 'featuredContent',
      type: 'reference',
      title: 'Featured content',
      to: [Flags.HAS_NEWS && { type: 'news' }, Flags.HAS_MAGAZINE && { type: 'magazine' }, ...routes].filter((e) => e),
      options: {
        filter: filterByRouteNewsMagazineAndTitle,
        disableNew: true,
      },
    },
    {
      name: 'intro',
      title: 'Intro text',
      description: 'A short and catchy introduction text for this menu item (max. 215 chars)',
      type: 'array',
      of: [introBlockContentType],
      validation: (Rule: Rule) => Rule.custom((value: any) => validateCharCounterEditor(value, 215)),
    },
  ],
  preview: {
    select: {
      label: 'label',
      group: 'group',
      url: 'url',
    },
    prepare(selection: any) {
      const { label, group = [], url } = selection
      return {
        title: label || 'No label added yet',
        subtitle: url || `Menu groups: ${group.length}`,
        media: EdsIcon(format_line_spacing),
      }
    },
  },
}
