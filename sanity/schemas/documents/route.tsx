import slugify from 'slugify'
import { Reference, Rule, SlugParent, SlugSchemaType, SlugSourceContext } from 'sanity'
import blocksToText from '../../helpers/blocksToText'
import { calendar_event, library_books } from '@equinor/eds-icons'
import { EdsIcon, TopicDocuments } from '../../icons'
import { Flags } from '../../src/lib/datasetHelpers'
import { withSlugValidation } from '../validations/validateSlug'
import SlugInput from '../components/SlugInput'
import { SanityClient, SanityDocument } from '@sanity/client'

export default (isoCode: string, title: string) => {
  return {
    type: 'document',
    title: `Page Routes ${title}`,
    name: `route_${isoCode}`,
    icon: () => EdsIcon(library_books),
    fieldsets: [
      {
        title: 'Slug',
        name: 'slug',
        description: '⚠️ This feature is still actively being worked on ⚠️',
        options: {
          collapsible: true,
          collapsed: false,
        },
      },
    ],
    // @TODO: Temp. solution aka 1. iteration.
    fields: [
      {
        title: 'Content',
        name: 'content',
        description: 'The content you want to appear at this path. Remember it needs to be published.',
        validation: (Rule: Rule) => Rule.required(),
        type: 'reference',
        to: [
          {
            type: 'page',
          },
          Flags.HAS_LANDING_PAGE && {
            type: 'landingPage',
          },
          Flags.HAS_EVENT && {
            type: 'event',
          },
          Flags.HAS_NEWSROOM && {
            type: 'newsroom',
          },
          Flags.HAS_MAGAZINE && {
            type: 'magazineIndex',
          },
        ].filter((e) => e),
        options: {
          filter: '_lang == $lang',
          filterParams: { lang: `${isoCode}` },
          disableNew: true,
        },
      },
      {
        title: 'Parent',
        name: 'parent',
        description: 'Unless this route is a top level route, it should have a parent.',
        type: 'reference',
        // Only allow a reference to the same language
        to: [{ type: `route_${isoCode}` }],
        // Only allow to select a route that does not have a parent
        // Two level url structure only for the time being?
        options: {
          filter: '!defined(parent)',
          disableNew: true,
        },
      },
      {
        name: 'topicSlug',
        title: 'Topic slug',
        type: 'string',

        placeholder: 'For example "Experienced professionals"',
        description: 'The unique part of the URL for this page. Should probably be something like the page title.',
        // validation: (Rule) => Rule.max(200),
        fieldset: 'slug',
      },
      {
        title: 'Complete URL for this page',
        name: 'slug',
        type: 'slug',
        fieldset: 'slug',
        components: {
          input: SlugInput,
        },
        options: withSlugValidation({
          source: (doc: SanityDocument) => slugify(doc['topicSlug'], { lower: true }),
          slugify: async (
            input: string,
            _schemaType: SlugSchemaType,
            context: SlugSourceContext & { client: SanityClient },
          ) => {
            const { client, parent } = context
            const document = parent as SlugParent & { parent: Reference }
            const refId = document.parent?._ref

            if (refId) {
              return client
                .fetch(/* groq */ `*[_id == $refId][0].slug.current`, { refId: refId })
                .then((parentSlug: string) => `${parentSlug}/${slugify(input)}`)
            } else {
              return `/${slugify(input)}`
            }
          },
        }),
        validation: (Rule: Rule) => Rule.required(),
      },
      {
        name: 'breadcrumbs',
        type: 'breadcrumbs',
      },
      {
        type: 'excludeFromSearch',
        name: 'excludeFromSearch',
      },
    ],
    preview: {
      select: {
        title: 'content.title',
        slug: 'slug.current',
        media: 'content.heroFigure.image',
        type: 'content._type',
      },
      prepare(selection: any) {
        const { title, slug, media, type } = selection
        const plainTitle = title ? blocksToText(title) : ''

        const thumbnail = media ? media : type === 'event' ? EdsIcon(calendar_event) : TopicDocuments

        return {
          title: plainTitle,
          subtitle: slug,
          media: thumbnail,
        }
      },
    },
  }
}
