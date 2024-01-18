import { flight_land, collection_4 } from '@equinor/eds-icons'
import type { PortableTextBlock, Rule } from 'sanity'
import blocksToText from '../../helpers/blocksToText'
import { EdsIcon } from '../../icons'
import CompactBlockEditor from '../components/CompactBlockEditor'
import { i18n } from '../documentTranslation'
import { configureTitleBlockContent } from '../editors'
import { configureBlockContent } from '../editors/blockContentType'

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
  smallText: false,
})

export default {
  type: 'document',
  title: `404 page`,
  name: `pageNotFound`,
  icon: () => EdsIcon(collection_4),
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
      name: 'title',
      type: 'array',
      title: 'Title',
      description: `Don't add the status code (404). The web will take care of that`,
      components: {
        input: CompactBlockEditor,
      },
      of: [titleContentType],
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      title: 'Text',
      name: 'text',
      type: 'array',
      of: [textContentType],
    },
    {
      title: 'Background image',
      name: 'backgroundImage',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }: { title: PortableTextBlock[] }) {
      const plainTitle = title ? blocksToText(title) : ''

      return {
        title: plainTitle,
        subtitle: 'Page not found',
        media: EdsIcon(flight_land),
      }
    },
  },
}
