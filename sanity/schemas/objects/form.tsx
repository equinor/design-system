import type { PortableTextBlock, Rule, ValidationContext } from 'sanity'
import blocksToText from '../../helpers/blocksToText'
import CompactBlockEditor from '../components/CompactBlockEditor'
import { configureBlockContent, configureTitleBlockContent } from '../editors'
import { validateRequiredIfVisible } from '../validations/validateRequiredIfVisible'
import { DownloadableFile } from './files'

const titleContentType = configureTitleBlockContent()

export type Form = {
  _type: 'form'
  form: FormType
  title?: PortableTextBlock[]
  ingress?: PortableTextBlock[]
  downloads: DownloadableFile[]
}

type FormType =
  | 'subscribeForm'
  | 'contactEquinorForm'
  | 'careersContactForm'
  | 'orderReportsForm'
  | 'careerFairAndVisitsForm'

const ingressContentType = configureBlockContent({
  h1: false,
  h2: false,
  h3: false,
  h4: false,
  attachment: false,
})

export default {
  name: 'form',
  type: 'object',
  title: 'Form',
  description: 'This component shows choosen form',
  fields: [
    {
      name: 'title',
      type: 'array',
      title: 'Title',
      description: 'The (optional) title/heading shown above the form.',
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
      type: 'string',
      name: 'form',
      description: 'Select the type of form to show',
      title: 'Type of form',
      options: {
        list: [
          { title: 'Subscribe Form', value: 'subscribeForm' },
          { title: 'Contact Equinor form', value: 'contactEquinorForm' },
          { title: 'Careers contact form', value: 'careersContactForm' },
          { title: 'Order reports', value: 'orderReportsForm' },
          { title: 'Career fairs and visits', value: 'careerFairAndVisitsForm' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      type: 'array',
      name: 'downloads',
      description: 'Downloadable reports to show in the Order reports form',
      title: 'Downloadable files',
      of: [{ type: 'downloadableFile', title: 'Downloadable file' }],
      validation: (Rule: Rule) =>
        Rule.custom((value: string, context: ValidationContext) => {
          const { parent } = context as { parent: Form }
          return validateRequiredIfVisible(parent?.form === 'orderReportsForm', value, 'You must add reports')
        }).unique(),
      hidden: ({ parent }: { parent: Form }) => parent?.form !== 'orderReportsForm',
    },
    {
      type: 'boolean',
      name: 'isHumanRightsRequest',
      description: 'This will set the category to human rights request in the form and makes its readonly.',
      title: 'Preselect human rights request category',
      hidden: ({ parent }: { parent: Form }) => parent?.form !== 'contactEquinorForm',
    },
  ],
  preview: {
    select: {
      title: 'title',
      type: 'form',
    },
    prepare({ title = [], type }: { title: PortableTextBlock[]; type: FormType }) {
      const plainTitle = title ? blocksToText(title) : undefined

      const getFormType = (type: FormType) => {
        if (type === 'subscribeForm') {
          return 'Subscribe Form'
        } else if (type == 'contactEquinorForm') {
          return 'Contact Equinor form'
        } else if (type == 'careersContactForm') {
          return 'Careers contact form'
        } else if (type == 'orderReportsForm') {
          return 'Order reports'
        }
        return 'Career fairs and visits'
      }

      return {
        title: plainTitle,
        subtitle: getFormType(type),
      }
    },
  },
}
