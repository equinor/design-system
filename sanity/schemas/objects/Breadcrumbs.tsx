import type { Reference, Rule, SanityDocument } from 'sanity'
import { BreadcrumbsInput } from '../components/Breadcrumbs'
import routes from '../routes'

export default {
  type: 'object',
  name: 'breadcrumbs',
  title: 'Breadcrumbs',
  fields: [
    {
      name: 'enableBreadcrumbs',
      type: 'boolean',
      title: 'Enable breadcrumbs',
      initialValue: false,
    },
    {
      name: 'useCustomBreadcrumbs',
      type: 'boolean',
      title: 'Use custom breadcrumbs',
      initialValue: false,
    },
    {
      name: 'customBreadcrumbs',
      type: 'array',
      title: 'Custom breadcrumbs',
      description: 'Add any pages (in order) you want displayed between Home and the slug of the current page',
      of: [
        {
          name: 'reference',
          title: 'Breadcrumb segment',
          type: 'reference',
          validation: (Rule: Rule) =>
            Rule.required().custom((value: Reference, context) => {
              const { document } = context
              if (document && document._id.replace('drafts.', '') === value._ref)
                return 'Breadcrumbs cannot link to themselves'

              return true
            }),
          to: routes,
          options: {
            filter: ({ document }: { document: SanityDocument }) => ({
              filter: `_type match $routeLang`,
              params: { routeLang: document._type },
            }),
            disableNew: true,
          },
        },
      ],
      validation: (Rule: Rule) => Rule.unique(),
    },
  ],
  components: {
    input: BreadcrumbsInput,
  },
}
