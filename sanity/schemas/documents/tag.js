import { defaultLanguage, languages } from '../../languages'
import { EdsIcon, TagIcon } from '../../icons'
import { tag_more } from '@equinor/eds-icons'
//takes every allowed language and makes a string field for each
const localeStrings = languages.map((lang) => ({
  name: lang.name,
  type: 'string',
  title: lang.title,
  validation: (Rule) => Rule.required(),
}))

const title = `title.${defaultLanguage.name}`

export default {
  type: 'document',
  name: `tag`,
  title: `Tag`,
  icon: () => EdsIcon(tag_more),
  fields: [
    {
      type: 'object',
      name: 'title',
      title: 'Title',
      fields: localeStrings,
    },
    {
      title: 'Key',
      name: 'key',
      type: 'slug',
      description: "This is a data point, no need to alter it beyond 'generate'",
      validation: (Rule) => Rule.required(),

      options: {
        source: title,
        slugify: (input) => input.toLowerCase().replace(/\s+/g, '-'),
      },
    },
  ],
  orderings: [
    {
      title: 'Title descending',
      name: 'titleDesc',
      by: [{ field: title, direction: 'desc' }],
    },
    {
      title: 'Title ascending',
      name: 'titleDesc',
      by: [{ field: title, direction: 'asc' }],
    },
  ],

  preview: {
    select: {
      title: title,
    },
    prepare(selection) {
      const { title } = selection
      // For debugging purposes
      return {
        title: title,
        media: TagIcon,
      }
    },
  },
}
