import type { Rule } from 'sanity'
import type { LinkSelector } from './linkSelector'
import type { DownloadableFile } from './files'
import type { DownloadableImage } from './downloadableImage'

export type RelatedLinks = {
  _type: 'relatedLinks'
}

export type RelatedLinksArray = (LinkSelector | DownloadableFile | DownloadableImage)[]

export default {
  name: 'relatedLinks',
  type: 'array',
  title: 'Related links',
  of: [
    { type: 'linkSelector', title: 'Link' },
    { type: 'downloadableFile', title: 'Downloadable file' },
    { type: 'downloadableImage', title: 'Downloadable image' },
  ],
  validation: (Rule: Rule) => Rule.unique(),
}
