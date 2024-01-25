import { validateInternalOrExternalUrl } from '../validations/validateInternalOrExternalUrl'
import type { Rule, ValidationContext, Reference } from 'sanity'
import routes from '../routes'
import { filterByRoute } from '../../helpers/referenceFilters'
import { EdsIcon } from '../../icons'
import { format_color_text } from '@equinor/eds-icons'

export type ColumnLink = {
  _type: 'link'
  label: string
  reference?: Reference
  url?: string
}

export default {
  type: 'document',
  title: `Footer`,
  name: `footer`,
  icon: () => EdsIcon(format_color_text),

  fields: [
    {
      title: 'Footer columns',
      name: 'footerColumns',
      type: 'array',
      validation: (Rule: Rule) => Rule.length(3),
      of: [
        {
          type: 'object',
          name: 'footerColumnGroup',
          title: 'Footer column',
          fields: [
            {
              type: 'string',
              name: 'columnHeader',
              title: 'Column header',
              validation: (Rule: Rule) => Rule.required(),
            },
            {
              type: 'array',
              name: 'columnLinks',
              title: 'Links',
              of: [
                {
                  type: 'object',
                  name: 'link',
                  title: 'Link',
                  fields: [
                    {
                      name: 'label',
                      type: 'string',
                      title: 'Label',
                      description: 'Link text',
                      validation: (Rule: Rule) => Rule.required(),
                    },
                    {
                      name: 'reference',
                      title: 'Internal link',
                      description: 'Use this field to reference an internal page.',
                      type: 'reference',

                      validation: (Rule: Rule) =>
                        Rule.custom((value: any, context: ValidationContext) => {
                          const { parent } = context as { parent: ColumnLink }
                          return validateInternalOrExternalUrl(value, parent.url)
                        }),
                      to: routes,
                      options: {
                        filter: filterByRoute,
                      },
                    },

                    {
                      name: 'url',
                      title: 'External URL',
                      description: 'Use this field to link to an external site.',
                      type: 'url',

                      validation: (Rule: Rule) =>
                        Rule.uri({ scheme: ['http', 'https', 'tel', 'mailto'] }).custom(
                          (value: any, context: ValidationContext) => {
                            const { parent } = context as { parent: ColumnLink }
                            return validateInternalOrExternalUrl(value, parent.reference)
                          },
                        ),
                    },
                  ],
                },
                {
                  type: 'object',
                  name: 'someLink',
                  title: 'Social media link',
                  fields: [
                    {
                      name: 'url',
                      title: 'URL',
                      description: 'Use this field to link to an external site.',
                      type: 'url',

                      validation: (Rule: Rule) =>
                        Rule.uri({ scheme: ['http', 'https', 'tel', 'mailto'] }).custom(
                          (value: any, context: ValidationContext) => {
                            const { parent } = context as { parent: ColumnLink }

                            return validateInternalOrExternalUrl(value, parent.reference)
                          },
                        ),
                    },
                    {
                      name: 'label',
                      type: 'string',
                      title: 'Label',
                      description: 'Link text',
                      validation: (Rule: Rule) => Rule.required(),
                    },
                    {
                      name: 'someType',
                      type: 'string',
                      title: 'Type of SoMe platform',
                      options: {
                        list: [
                          { title: 'Facebook', value: 'facebook' },
                          { title: 'Instagram', value: 'instagram' },
                          { title: 'Twitter', value: 'twitter' },
                          { title: 'LinkedIn', value: 'linkedin' },
                          { title: 'YouTube', value: 'youtube' },
                        ],
                        layout: 'radio',
                      },
                      validation: (Rule: Rule) => Rule.required(),
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
