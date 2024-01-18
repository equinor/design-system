import CompactBlockEditor from '../components/CompactBlockEditor'
import { configureTitleBlockContent } from '../editors'
import { EdsIcon } from '../../icons'
import { library_image } from '@equinor/eds-icons'
import blocksToText from '../../helpers/blocksToText'
import type { Rule } from 'sanity'

const titleContentType = configureTitleBlockContent()

export default {
  name: 'imageCarousel',
  title: 'Image carousel',
  type: 'object',
  fieldsets: [
    {
      title: 'Carousel options',
      name: 'carouselOptions',
      description: 'Additional settings for the carousel',
      options: {
        collapsible: true,
        collapsed: false,
      },
    },
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
      components: {
        input: CompactBlockEditor,
      },
      of: [titleContentType],
      title: 'Title',
    },
    {
      type: 'array',
      name: 'items',
      description: 'Add images for the carousel',
      title: 'Carousel items',
      of: [{ type: 'imageWithAltAndCaption' }],
      validation: (Rule: Rule) => Rule.required().min(2),
    },
    {
      type: 'number',
      name: 'delay',
      title: 'Delay',
      description: 'Time in seconds that an image should be visible for before transitioning to the next.',
      initialValue: 3,
      fieldset: 'carouselOptions',
      validation: (Rule: Rule) => Rule.required().min(2),
    },
    {
      type: 'boolean',
      name: 'autoplay',
      title: 'Autoplay',
      description: 'Whether the carousel should autoplay or not.',
      initialValue: true,
      fieldset: 'carouselOptions',
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
      title: 'title',
      items: 'items',
    },
    prepare(selection: any) {
      const { title, items } = selection
      const length = items ? items.length : 0

      return {
        title: title ? blocksToText(title) : 'Untitled image carousel',
        subtitle: `Image carousel with ${length} items`,
        media: EdsIcon(library_image),
      }
    },
  },
}
