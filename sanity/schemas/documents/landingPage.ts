import { flight_land } from '@equinor/eds-icons'
import type { PortableTextBlock, Rule } from 'sanity'
import blocksToText from '../../helpers/blocksToText'
import { filterByLang } from '../../helpers/referenceFilters'
import { EdsIcon } from '../../icons'
import CompactBlockEditor from '../components/CompactBlockEditor'
import { i18n } from '../documentTranslation'
import { configureTitleBlockContent } from '../editors'
import { configureBlockContent } from '../editors/blockContentType'

const titleContentType = configureTitleBlockContent()
const ingressContentType = configureBlockContent({
  h1: false,
  h2: false,
  h3: false,
  h4: false,
  attachment: false,
})

export default {
  type: 'document',
  title: 'Landing page',
  name: 'landingPage',
  i18n,
  icon: () => EdsIcon(flight_land),
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
      name: 'openGraphImage',
      type: 'image',
      title: 'Open Graph Image',
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
      title: 'Ingress',
      name: 'ingress',
      type: 'array',
      of: [ingressContentType],
    },
    {
      title: 'Landing page content',
      name: 'tocContent',
      description: 'Reference the sub menu you want to populate this landing page with',
      type: 'reference',
      to: [{ type: 'subMenu' }],
      options: {
        filter: filterByLang,
        disableNew: true,
      },
      validation: (Rule: Rule) => Rule.required(),
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
        subtitle: 'Landing page',
        media: EdsIcon(flight_land),
      }
    },
  },
}
