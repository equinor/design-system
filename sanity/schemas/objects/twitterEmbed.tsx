import { twitter } from '@equinor/eds-icons'
import { Rule, ValidationContext } from 'sanity'
import { EdsIcon } from '../../icons'
import CompactBlockEditor from '../components/CompactBlockEditor'
import { configureBlockContent, configureTitleBlockContent } from '../editors'

export type TwitterEmbed = {
  _type: 'twitterEmbed'
  embedType: string
  embedValue: string
}

const titleContentType = configureTitleBlockContent()
const ingressContentType = configureBlockContent({
  h1: false,
  h2: false,
  h3: false,
  h4: false,
  attachment: false,
})
export default {
  title: 'Twitter Embed',
  description:
    'This component displays twitter feeds. This sets marketing cookies hence cookie policy is set to marketing by default.',
  name: 'twitterEmbed',
  type: 'object',
  fieldsets: [
    {
      title: 'Design options',
      name: 'design',
      description: 'Some options for design',
      options: {
        collapsible: true,
        collapsed: false,
      },
    },
  ],
  fields: [
    {
      name: 'title',
      type: 'array',
      title: 'Title',
      description: 'The (optional) title/heading shown above the iframe.',
      components: {
        input: CompactBlockEditor,
      },
      of: [titleContentType],
    },
    {
      name: 'ingress',
      title: 'Ingress',
      type: 'array',
      of: [ingressContentType],
    },
    {
      name: 'embedType',
      type: 'string',
      options: {
        list: [
          { title: 'Timeline/feed', value: 'timeline' },
          { title: 'Single Tweet', value: 'tweet' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'embedValue',
      type: 'string',
      description:
        'Enter tweetid(number) for embedding single tweet or twitter handle (without @) for embedding timeline.',
      validation: (Rule: Rule) =>
        Rule.custom((embedValue: string, context: ValidationContext) => {
          const { parent } = context as { parent: TwitterEmbed }
          if (parent.embedType === 'tweet') return /^\d+$/.test(embedValue) ? true : 'Invalid tweetid'
          else
            return embedValue?.startsWith('@')
              ? "Enter twitter handle without '@'"
              : embedValue === undefined
              ? 'Twitter handle is required'
              : true
        }).error(),
    },
    {
      title: 'Background',
      description: 'Pick a colour for the background. Default is white.',
      name: 'background',
      type: 'colorlist',
      fieldset: 'design',
    },
  ],
  preview: {
    select: {
      embedType: 'embedType',
    },
    prepare({ embedType }: any) {
      return {
        title: 'Twitter Embed component',
        subtitle: embedType,
        media: EdsIcon(twitter),
      }
    },
  },
}
