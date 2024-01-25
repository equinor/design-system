import type { Rule, ValidationContext } from 'sanity'
import blocksToText from '../../helpers/blocksToText'
import { filterByPages } from '../../helpers/referenceFilters'
import { Flags } from '../../src/lib/datasetHelpers'
import routes from '../routes'
import { EdsIcon } from '../../icons'
import { directions } from '@equinor/eds-icons'
import { apiVersion } from '../../sanity.client'

export default {
  title: 'Redirect',
  name: 'redirect',
  type: 'document',
  icon: () => EdsIcon(directions),
  fields: [
    {
      title: 'From:',
      description: 'Example: /this-is/an-example',
      name: 'from',
      type: 'string',
      validation: (Rule: Rule) =>
        Rule.custom(async (value: string, context: ValidationContext) => {
          const { document } = context
          const documentId = document?._id.replace('drafts.', '')
          const query = /* groq */ `*[_type == 'redirect' && from == $value && _id != $documentId && !(_id in path('drafts.**'))]`

          const params = { value, documentId }
          const redirects = await context.getClient({ apiVersion: apiVersion }).fetch(query, params)

          if (!value) {
            return 'Slug is required'
          } else if (value.charAt(0) !== '/') {
            return "Slug must begin with '/'. Do not add https://www.equinor.etc"
          } else if (redirects.length > 0) {
            return 'Another redirect from this path already exists'
          }

          return true
        }),
    },
    {
      title: 'To:',
      name: 'to',
      type: 'reference',
      to: [
        Flags.HAS_LOCAL_NEWS && {
          type: 'localNews',
        },
        Flags.HAS_MAGAZINE && {
          type: 'magazine',
        },
        Flags.HAS_NEWS && {
          type: 'news',
        },
        ...routes,
      ].filter((e) => e),
      validation: (Rule: Rule) => Rule.required(),
      options: {
        filter: filterByPages,
        disableNew: true,
      },
    },
  ],
  preview: {
    select: {
      type: 'to._type',
      newsTitle: 'to.title',
      newsMedia: 'to.heroImage.image',
      magazineTitle: 'to.content.title',
      magazineMedia: 'to.heroFigure.image',
      routeTitle: 'to.content.title',
      routeMedia: 'to.content.heroFigure.image',
      newSlug: 'to.slug.current',
      oldSlug: 'from',
    },
    prepare(selection: Record<string, any>) {
      const { type, newsTitle, newsMedia, magazineTitle, magazineMedia, routeMedia, routeTitle, newSlug, oldSlug } =
        selection
      let title, media
      if (type === 'news' || type === 'localNews') {
        title = newsTitle
        media = newsMedia
      } else if (type === 'magazine') {
        title = blocksToText(magazineTitle)
        media = magazineMedia
      } else {
        title = blocksToText(routeTitle)
        media = routeMedia
      }
      return {
        media: media,
        title: 'From: ' + oldSlug,
        subtitle: 'To: ' + title + ' (' + newSlug + ')',
      }
    },
  },
}
