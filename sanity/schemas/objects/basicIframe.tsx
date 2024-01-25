// This version of the iframe is used by the Event and News templates

import { code } from '@equinor/eds-icons'
import { EdsIcon } from '../../icons'

import type { PortableTextBlock, Rule, ValidationContext } from 'sanity'
import blocksToText from '../../helpers/blocksToText'
import CompactBlockEditor from '../components/CompactBlockEditor'
import { configureTitleBlockContent } from '../editors'
import type { ColorSelectorValue } from '../components/ColorSelector'

const titleContentType = configureTitleBlockContent()

export type IFrame = {
  _type: 'basicIframe'
  title?: PortableTextBlock[]
  frameTitle: string
  url: string
  aspectRatio: string
  height?: number
  background?: ColorSelectorValue
  cookiePolicy: 'none' | 'marketing' | 'statistics'
}

export default {
  name: 'basicIframe',
  title: 'Iframe',
  type: 'object',
  fieldsets: [
    {
      title: 'IFrame settings',
      name: 'iframe',
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
      name: 'frameTitle',
      type: 'string',
      title: 'Frame title',
      fieldset: 'iframe',

      description: 'The title of the iframe. This value is not visible on the page but is required for accessibility.',
      validation: (Rule: Rule) =>
        Rule.custom((value: string, context: ValidationContext) => {
          const { parent } = context as { parent: IFrame }
          return parent?.url && value === undefined ? 'Required' : true
        }),
    },
    {
      name: 'url',
      type: 'url',
      title: 'Frame URL',
      description: 'Link to the content to be loaded inside the iframe.',
      fieldset: 'iframe',
      validation: (Rule: Rule) =>
        Rule.custom((value: any, context: ValidationContext) => {
          const { parent } = context as { parent: IFrame }
          return (parent?.title || parent?.frameTitle) && value === undefined ? 'Required' : true
        }),
    },
    {
      name: 'cookiePolicy',
      type: 'string',
      title: 'Cookie policy',
      description: 'Select which cookie policy applies to this iframe.',
      fieldset: 'iframe',

      options: {
        list: [
          { title: 'None', value: 'none' },
          { title: 'Marketing', value: 'marketing' },
          { title: 'Statistics', value: 'statistics' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'none',
      validation: (Rule: Rule) => Rule.required(),
    },

    {
      name: 'aspectRatio',
      type: 'string',
      title: 'Aspect ratio',
      options: {
        list: [
          { title: '16:9', value: '16:9' },
          { title: '4:3', value: '4:3' },
          { title: '1:1', value: '1:1' },
        ],
        layout: 'dropdown',
      },
      fieldset: 'iframe',
      initialValue: '16:9',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'height',
      type: 'number',
      title: 'Height',
      description: 'Set a fixed height in pixels for the iframe. Note: this will override the aspect ratio setting.',
      fieldset: 'iframe',
      validation: (Rule: Rule) => Rule.positive().greaterThan(0).precision(0),
    },
  ],
  preview: {
    select: {
      title: 'title',
      frameTitle: 'frameTitle',
    },
    prepare({ title, frameTitle }: { title: PortableTextBlock[]; frameTitle: string }) {
      const plainTitle = title ? blocksToText(title) : undefined

      return {
        title: plainTitle || frameTitle,
        subtitle: `IFrame component`,
        media: EdsIcon(code),
      }
    },
  },
}
