/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { Rule } from 'sanity'
import blocksToText from '../../helpers/blocksToText'
import { AccordionComponent } from '../../icons'
import CompactBlockEditor from '../components/CompactBlockEditor'
import { configureTitleBlockContent } from '../editors'
import { configureBlockContent } from '../editors/blockContentType'
import { validateComponentAnchor } from '../validations/validateAnchorReference'
import type { ColorSelectorValue } from '../components/ColorSelector'

export type Accordion = {
  _type: 'accordion'
  title: any
  ingress?: any
  accordion: any[]
  background: ColorSelectorValue
}

const titleContentType = configureTitleBlockContent()
const ingressContentType = configureBlockContent({
  h1: false,
  h2: false,
  h3: false,
  h4: false,
  attachment: false,
})

export default {
  title: 'Accordion',
  name: 'accordion',
  type: 'object',
  fieldsets: [
    {
      name: 'design',
      title: 'Design options',
    },
    {
      name: 'anchor',
      title: 'Additional anchor point reference. (Deprecated)',
      description:
        'If the anchor reference to this component is set using anchor link component, the value here will be overridden',
      options: {
        collapsible: true,
        collapsed: true,
      },
    },
    {
      name: 'seo',
      title: 'SEO',
      description: 'Enable structured markup to show rich results on Google search',
    },
  ],
  fields: [
    {
      name: 'enableStructuredMarkup',
      type: 'boolean',
      title: "Show the accordion content (FAQ's) as rich results",
      description: 'Enable this only if its an FAQ',
      fieldset: 'seo',
    },
    {
      name: 'title',
      type: 'array',
      title: 'Title',
      components: {
        input: CompactBlockEditor,
      },
      of: [titleContentType],
      validation: (Rule: Rule) => Rule.required().warning('Should we warn for missing title'),
    },
    {
      title: 'Ingress',
      name: 'ingress',
      type: 'array',
      of: [ingressContentType],
    },
    {
      name: 'image',
      type: 'imageWithAlt',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'anchor',
      type: 'anchorReferenceField',
      title: 'Anchor reference',
      validation: (Rule: Rule) => [
        Rule.max(0).warning('Clear this field and use anchor link component instead.'),
        // @ts-ignore
        Rule.custom((value: string, context: any) => validateComponentAnchor(value, context)),
      ],
      fieldset: 'anchor',
      readOnly: ({ value }: { value?: string }) => !value,
    },
    {
      title: 'Accordion items',
      name: 'accordion',
      type: 'array',
      of: [{ type: 'accordionItem' }],
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      title: 'Background',
      description: 'Pick a colour for the background. Default is white.',
      name: 'background',
      type: 'colorlist',
      fieldset: 'design',
    },
  ].filter((e) => e),
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title = '' }: { title: any }) {
      const plainTitle = title ? blocksToText(title) : undefined

      return {
        title: plainTitle || 'Missing title',
        subtitle: `Accordion component.`,
        media: AccordionComponent,
      }
    },
  },
}
