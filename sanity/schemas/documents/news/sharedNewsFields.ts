import { configureBlockContent } from '../../editors/blockContentType'
import { validateCharCounterEditor } from '../../validations/validateCharCounterEditor'
import type { Rule, ValidationContext } from 'sanity'

const blockContentType = configureBlockContent()
const ingressBlockContentType = configureBlockContent({
  h1: false,
  h2: false,
  h3: false,
  h4: false,
  internalLink: false,
  externalLink: false,
  attachment: false,
  lists: false,
})

const validateRelatedLinksTitle = (value: any, context: any) => {
  const links = context.document.relatedLinks.links

  if (!links) return true

  if (!value && links.length > 0) {
    return 'A title for this component is required if links have been selected.'
  }

  return true
}

export const isLive = {
  name: 'live',
  title: 'Live',
  type: 'boolean',
  initialValue: false,
  readOnly: true,
  description: `This can only be changed by clicking "Make Public" on a Published article`,
  hidden: true,
}

export const seo = {
  name: 'seo',
  type: 'titleAndMeta',
  title: 'Meta information',
}

export const openGraphImage = {
  name: 'openGraphImage',
  type: 'imageWithAlt',
  title: 'Open Graph Image',
  description: 'You can override the hero image as the SoMe image by uploading another image here.',
}

export const title = {
  name: 'title',
  title: 'Title',
  type: 'string',
  validation: (Rule: Rule) => [Rule.required(), Rule.max(100).warning('Title should be max 100 characters')],
}

type PublishDateTimeType = {
  customPublicationDate: boolean
  publishDateTime: string
}

export const publishDateTime = [
  {
    title: 'Custom publication date and time',
    name: 'customPublicationDate',
    description: 'Use this if you want to display a custom publication date',
    type: 'boolean',
    initialValue: false,
  },
  {
    title: 'Publication date and time',
    description: 'Date and time of when the article will be published',
    name: 'publishDateTime',
    type: 'datetime',
    options: {
      timeStep: 1,
      calendarTodayLabel: 'Today',
    },
    hidden: ({ parent }: { parent: PublishDateTimeType }) => !parent.customPublicationDate,
    validation: (Rule: Rule) =>
      Rule.custom((value: PublishDateTimeType, context: ValidationContext) => {
        const { parent } = context as { parent: PublishDateTimeType }
        if (!parent.customPublicationDate || value) {
          return true
        } else {
          return 'Field is required'
        }
      }),
  },
  {
    // Set automatically in the custom action "ConfirmPublishWithi18n"
    title: 'Date and time of when the document was first published at',
    name: 'firstPublishedAt',
    type: 'datetime',
    readOnly: true,
    hidden: true,
  },
]

export const tags = {
  title: 'Topic tags',
  name: 'tags',
  type: 'array',
  description: 'Add tags to describe the content of this news article',
  of: [
    {
      type: 'reference',
      to: [{ type: 'tag' }],
      options: { disableNew: true },
    },
  ],
}

export const countryTags = {
  title: 'Country tags',
  name: 'countryTags',
  type: 'array',
  description: 'Select the country or countries this news article is relevant for',
  of: [
    {
      type: 'reference',
      to: [{ type: 'countryTag' }],
      options: { disableNew: true },
    },
  ],
}

export const subscriptionType = {
  title: 'News Subscription Type',
  name: 'subscriptionType',
  type: 'string',
  description: 'This news article will be sent to all the users who subscribed to below selected type.',
  options: {
    list: [
      { title: 'General News', value: 'Company' },
      { title: 'Stock Market Announcements', value: 'Stock' },
      { title: 'Crude Oil Assays', value: 'Crude' },
    ],
    layout: 'dropdown',
  },
}

export const newsSlugField = {
  name: 'newsSlug',
  title: 'News slug',
  type: 'string',
  placeholder: 'For example "Experienced professionals"',
  description: 'The unique part of the URL for this topic page. Should probably be something like the page title.',
  // validation: (Rule) => Rule.max(200),
}

export const heroImage = {
  name: 'heroImage',
  title: 'Hero image',
  type: 'imageWithAltAndCaption',
  validation: (Rule: Rule) => Rule.required(),
}

export const ingress = {
  name: 'ingress',
  title: 'Ingress',
  description: 'Lead paragraph. Shown in article and on cards. Max 400 characters',
  type: 'array',
  of: [ingressBlockContentType],
  validation: (Rule: Rule) => Rule.custom((value: any) => validateCharCounterEditor(value, 400)),
}

export const content = {
  name: 'content',
  title: 'Content',
  type: 'array',
  of: [blockContentType, { type: 'pullQuote' }, { type: 'positionedInlineImage' }, { type: 'factbox' }],
  validation: (Rule: Rule) =>
    Rule.custom((value: any) => {
      if (!value || value.length === 0) {
        return 'Required'
      }
      return true
    }),
}

export const iframe = {
  title: 'IFrame',
  name: 'iframe',
  description: 'Use this to add an iframe to this article. This could for example be a livestream, video, or map.',
  type: 'basicIframe',
  options: {
    collapsible: true,
    collapsed: true,
  },
}

export const relatedLinks = {
  name: 'relatedLinks',
  title: 'More on this topic',
  description: 'Optional list of related links to this article.',
  type: 'object',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (Rule: Rule) => Rule.custom((value, context) => validateRelatedLinksTitle(value, context)),
    },
    {
      name: 'links',
      title: 'Links and downloads',
      type: 'relatedLinks',
    },
  ],
}

export const excludeFromSearch = {
  type: 'excludeFromSearch',
  name: 'excludeFromSearch',
}
