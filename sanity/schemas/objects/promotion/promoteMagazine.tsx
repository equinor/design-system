import { library_books } from '@equinor/eds-icons'
import type { Rule, Reference } from 'sanity'
import { filterMagazineByLang } from '../../../helpers/referenceFilters'
import { EdsIcon } from '../../../icons'

export type MagazinePromotion = {
  manuallySelectArticles: boolean
  promotedArticles: Reference[]
  tags: Reference[]
}

export default {
  title: 'Magazine promotion',
  name: 'promoteMagazine',
  type: 'object',
  fields: [
    {
      name: 'manuallySelectArticles',
      type: 'boolean',
      title: 'Manually select Magazine articles',
      description: `Use this option if you want to manually select the articles to promote`,
      initialValue: false,
    },
    {
      title: 'Magazine articles to be promoted',
      name: 'promotedArticles',
      description: 'Select the individual articles you want to promote',
      type: 'array',
      of: [
        {
          title: 'Add article',
          type: 'reference',
          to: [
            {
              type: 'magazine',
            },
          ],
          options: {
            disableNew: true,
            filter: filterMagazineByLang,
          },
        },
      ],
      validation: (Rule: Rule) => Rule.unique(),
      hidden: ({ parent }: { parent: MagazinePromotion }) => parent?.manuallySelectArticles === false,
    },
    {
      title: 'Magazine tag(s)',
      description: 'Select magazine tags you want to promote',
      name: 'tags',
      type: 'array',
      of: [
        {
          title: 'Select the magazine tag(s) to promote',
          type: 'reference',
          to: [{ type: 'magazineTag' }],
          options: { disableNew: true },
        },
      ],
      validation: (Rule: Rule) => Rule.unique(),
      options: { sortable: false },
      hidden: ({ parent }: { parent: MagazinePromotion }) => parent?.manuallySelectArticles === true,
    },
  ],
  preview: {
    select: {
      tags: 'tags',
      articles: 'promotedArticles',
      manualSelection: 'manuallySelectArticles',
    },
    prepare({
      tags,
      articles,
      manualSelection,
    }: {
      tags: Reference[]
      articles: Reference[]
      manualSelection: boolean
    }) {
      if (manualSelection) {
        return {
          title: `Showing ${articles.length || 0} manually selected articles`,
          subtitle: `Magazine promotion | Manual`,
          media: EdsIcon(library_books),
        }
      }

      return {
        title: `Automatically selecting articles from ${tags.length || 0} tags`,
        subtitle: `Magazine promotion | Automatic`,
        media: EdsIcon(library_books),
      }
    },
  },
}
