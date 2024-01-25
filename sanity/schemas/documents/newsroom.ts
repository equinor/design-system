import blocksToText from '../../helpers/blocksToText'
import CompactBlockEditor from '../components/CompactBlockEditor'
import { i18n } from '../documentTranslation'
import { configureTitleBlockContent } from '../editors'
import { configureBlockContent } from '../editors/blockContentType'
import { file } from '@equinor/eds-icons'
import { EdsIcon } from '../../icons'
import type { PortableTextBlock, Rule } from 'sanity'

const titleContentType = configureTitleBlockContent()
const textContentType = configureBlockContent({
  h1: false,
  h2: true,
  h3: false,
  h4: false,
  externalLink: false,
  internalLink: false,
  lists: false,
  attachment: false,
})

export default {
  type: 'document',
  title: 'Newsroom',
  name: 'newsroom',
  icon: () => EdsIcon(file),
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
  ],
  fields: [
    {
      title: 'Meta information',
      name: 'seo',
      type: 'titleAndMeta',
      fieldset: 'metadata',
    },
    {
      title: 'Open Graph Image',
      name: 'openGraphImage',
      type: 'imageWithAlt',
      description: 'You can override the hero image as the SoMe image by uploading another image here.',
      fieldset: 'metadata',
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
      title: 'Text',
      name: 'ingress',
      type: 'array',
      of: [textContentType],
    },
  ],
  preview: {
    select: {
      title: 'title',
      ingress: 'ingress',
    },
    prepare({ title, ingress }: { title: PortableTextBlock[]; ingress: PortableTextBlock[] }) {
      const plainTitle = title ? blocksToText(title) : ''

      return {
        title: plainTitle,
        subtitle: blocksToText(ingress) || '',
      }
    },
  },
}
