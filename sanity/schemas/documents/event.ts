import { calendar_event, image } from '@equinor/eds-icons'
import type { PortableTextBlock, Rule, ValidationContext } from 'sanity'
import blocksToText from '../../helpers/blocksToText'
import { EdsIcon } from '../../icons'
import CompactBlockEditor from '../components/CompactBlockEditor'
import { i18n } from '../documentTranslation'
import { configureBlockContent, configureTitleBlockContent } from '../editors'
import basicIframe, { IFrame } from '../objects/basicIframe'
import type { EventDate } from '../objects/eventDate'
import type { RelatedLinksArray } from '../objects/relatedLinks'

const titleContentType = configureTitleBlockContent()
const blockContentType = configureBlockContent()
const ingressContentType = configureBlockContent({
  h1: false,
  h2: false,
  h3: false,
  h4: false,
  attachment: false,
})

const validateRelatedLinksTitle = (value: string, context: ValidationContext) => {
  const { parent } = context as { parent: { title: string; links: RelatedLinksArray } }
  const links = parent.links

  if (!links) return true

  if (!value && links.length > 0) {
    return 'A title for this component is required if links have been selected.'
  }

  return true
}

export default {
  type: 'document',
  title: 'Event',
  name: 'event',
  icon: () => EdsIcon(image),
  i18n,
  fieldsets: [
    {
      title: 'SEO & metadata',
      name: 'metadata',
      description: 'This part is used for meta information when this content is used on the web',
      options: {
        collapsible: true,
        collapsed: true,
      },
    },
    {
      title: 'People and contacts',
      name: 'people',
      options: {
        collapsible: false,
        collapsed: false,
      },
    },
    {
      title: 'Tags',
      name: 'tagFieldset',
      options: {
        collapsible: true,
        collapsed: false,
      },
    },
  ],
  fields: [
    {
      title: 'Meta information',
      name: 'seo',
      type: 'titleAndMeta',
      fieldset: 'metadata',
    },
    {
      name: 'openGraphImage',
      type: 'image',
      title: 'Open Graph Image',
      description: 'You can override the hero image as the SoMe image by uploading another image here.',
      fieldset: 'metadata',
    },
    {
      title: 'Event tags',
      name: 'eventTags',
      type: 'array',
      description: 'Add tags to this event',
      of: [
        {
          type: 'reference',
          to: [{ type: 'eventTag' }],
          options: { disableNew: true },
        },
      ],
      fieldset: 'tagFieldset',
    },
    {
      name: 'title',
      type: 'array',
      title: 'Title',
      components: {
        input: CompactBlockEditor,
      },
      of: [titleContentType],
      validation: (Rule: Rule) => Rule.required(),
    },

    {
      name: 'location',
      type: 'string',
      title: 'Location',
    },
    {
      title: 'Date information',
      name: 'eventDate',
      type: 'eventDate',
    },
    {
      title: 'Ingress',
      name: 'ingress',
      type: 'array',
      of: [ingressContentType],
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [blockContentType, basicIframe],
    },
    {
      title: 'IFrame (Deprecated)',
      name: 'iframe',
      type: 'basicIframe',
      validation: (Rule: Rule) =>
        Rule.custom((value: IFrame) => {
          if (!value) {
            return true
          } else return 'IFrame is deprecated. Please insert iframe inside the content field.'
        }).warning(),

      description: 'Iframe is deprecated on event page. You can insert iframe directly in to the content field above.',
    },
    {
      title: 'Title',
      name: 'promotedPeopleTitle',
      type: 'array',
      fieldset: 'people',
      components: {
        input: CompactBlockEditor,
      },
      of: [titleContentType],
    },
    {
      title: ' ',
      name: 'promotedPeople',
      type: 'promotePeople',
      fieldset: 'people',
    },
    { title: 'Contact list', type: 'contactList', name: 'contactList' },
    {
      name: 'relatedLinks',
      title: 'Links and downloads',
      description: 'Optional list of related links to this event.',
      type: 'object',
      fields: [
        {
          name: 'title',
          type: 'string',
          title: 'Title',
          validation: (Rule: Rule) =>
            Rule.custom((value: string, context: ValidationContext) => validateRelatedLinksTitle(value, context)),
        },
        {
          name: 'links',
          title: 'Links and downloads',
          type: 'relatedLinks',
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      date: 'eventDate',
    },
    prepare({ title, date }: { title: PortableTextBlock[]; date: EventDate }) {
      const eventDate = date?.date ? `${date.date} ${date?.timezone}` : 'No date set'
      return {
        title: title ? blocksToText(title) : 'Untitled event',
        subtitle: eventDate,
        media: EdsIcon(calendar_event),
      }
    },
  },
}
