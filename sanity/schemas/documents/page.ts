import blocksToText from '../../helpers/blocksToText'
import { defaultColors } from '../components/ColorSelector'
import { Flags } from '../../src/lib/datasetHelpers'
import { i18n } from '../documentTranslation'
import { HeroTypes } from '../HeroTypes'
import sharedHeroFields from './header/sharedHeaderFields'
import { EdsIcon } from '../../icons'
import { paste } from '@equinor/eds-icons'
// import { done } from '@equinor/eds-icons'

// export default ({ topicPrefix, title }: { topicPrefix: Topics; title: string }) => {
export default {
  type: 'document',
  name: 'page',
  title: 'Topic page',
  icon: () => EdsIcon(paste),
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
      name: 'content',
      type: 'array',
      title: 'Page sections',
      of: [
        { type: 'textBlock' },
        { type: 'teaser' },
        { type: 'fullWidthImage' },
        { type: 'fullWidthVideo' },
        { type: 'figure' },
        { type: 'textWithIconArray' },
        { type: 'pullQuote', initialValue: { background: defaultColors[0] } },
        { type: 'accordion' },
        { type: 'promoTileArray' },
        { type: 'promotion' },
        { type: 'table' },
        { type: 'stockValuesApi' },
        { type: 'iframe' },
        { type: 'cookieDeclaration' },
        Flags.HAS_FORMS && { type: 'form' },
        Flags.HAS_NEWS && { type: 'newsList' },
        Flags.HAS_TWITTER_FEED && { type: 'twitterEmbed' },
        { type: 'anchorLink' },
        { type: 'imageCarousel' },
        { type: 'iframeCarousel' },
        { type: 'videoPlayer' },
        { type: 'videoPlayerCarousel' },
      ].filter((e) => e),
    },
  ].filter((e) => e),
  orderings: [
    {
      title: 'Title ',
      name: 'titleAsc',
      // Yes, this will add a warning in the console, but we still need the [0] since it's a rich text editor
      // Might be worth to look into if it is a better way of sorting rich text editors
      by: [{ field: 'title[0].children[0].text', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      image: 'heroFigure.image',
      video: 'heroLoopingVideo.thumbnail',
      type: 'heroType',
    },
    prepare(selection: any) {
      const { title, image, video, type } = selection
      const plainTitle = title ? blocksToText(title) : ''
      const media = type === HeroTypes.LOOPING_VIDEO ? video : image
      return {
        title: plainTitle,
        subtitle: 'Topic content',
        media,
      }
    },
  },
}
