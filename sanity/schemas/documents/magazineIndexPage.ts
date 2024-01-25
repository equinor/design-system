import blocksToText from '../../helpers/blocksToText'
import { i18n } from '../documentTranslation'
import { configureBlockContent } from '../editors/blockContentType'
import MagazineFooterComponent from '../objects/magazineFooterComponent'
import sharedHeroFields from './header/sharedHeaderFields'
import { EdsIcon } from '../../icons'
import { bookmarks } from '@equinor/eds-icons'

import type { PortableTextBlock, Rule } from 'sanity'

const textContentType = configureBlockContent({
  h1: false,
  h2: true,
  h3: true,
  h4: false,
  externalLink: false,
  internalLink: true,
  lists: true,
  attachment: false,
})

export default {
  type: 'document',
  title: 'Magazine Index Page',
  name: 'magazineIndex',
  icon: () => EdsIcon(bookmarks),
  i18n,
  fieldsets: [
    {
      title: 'Header',
      name: 'header',
    },
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
    ...sharedHeroFields,
    {
      title: 'Text',
      name: 'ingress',
      type: 'array',
      of: [textContentType],
      fieldset: 'header',
    },
    {
      title: 'Ingress Background',
      description: 'Pick a colour for the background. Default is white.',
      name: 'ingressBackground',
      type: 'colorlist',
      fieldset: 'header',
    },
    {
      title: 'Promoted Magazine Tags',
      name: 'promotedMagazineTags',
      description: 'Place the magazine tags in the correct order',
      type: 'array',
      of: [
        {
          title: 'Magazine Tag',
          type: 'reference',
          to: [{ type: 'magazineTag' }],
          options: {
            // Disable new since this button does not work with dynamic initial
            // values  :(
            disableNew: true,
          },
        },
      ],
      validation: (Rule: Rule) => Rule.unique().min(5).max(5),
    },
    MagazineFooterComponent,
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
