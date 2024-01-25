/* eslint-disable @typescript-eslint/ban-ts-comment */
import { text_field } from '@equinor/eds-icons'
import type { PortableTextBlock, Reference, Rule, SanityDocument, ValidationContext } from 'sanity'
import type { ColorSelectorValue } from '../components/ColorSelector'
import blocksToText from '../../helpers/blocksToText'
import { EdsIcon } from '../../icons'
import CompactBlockEditor from '../components/CompactBlockEditor'
import { configureBlockContent, configureTitleBlockContent } from '../editors'
import { validateComponentAnchor } from '../validations/validateAnchorReference'

const blockContentType = configureBlockContent({
  h1: false,
  h2: false,
  h3: true,
  h4: false,
  attachment: false,
})

const ingressContentType = configureBlockContent({
  h1: false,
  h2: false,
  h3: false,
  h4: false,
  attachment: false,
})

const blockContentTypeForBigText = configureBlockContent({
  h1: false,
  h2: false,
  h3: false,
  h4: false,
  attachment: false,
  smallText: false,
  normalTextOverride: {
    title: 'Normal',
    value: 'normal',
    component: ({ children }: { children: React.ReactNode }) => <span style={{ fontSize: '42px' }}>{children}</span>,
  },
})

const titleContentType = configureTitleBlockContent()

type TextBlock = {
  overline?: string
  title?: string
  anchor?: string
  ingress?: string
  text?: string
  isBigText?: boolean
  bigText?: PortableTextBlock[]
  action?: Reference[]
  splitList?: boolean
  overrideButtonStyle?: boolean
  background?: ColorSelectorValue
}

type TextBlockDocument = {
  parent: TextBlock
}

export default {
  name: 'textBlock',
  title: 'Text block',
  type: 'object',
  fieldsets: [
    {
      title: 'Thumbnail Image',
      name: 'thumbnail',
      description: 'A small image acting as a thumbnail above the title.',
      options: {
        collapsible: true,
        collapsed: true,
      },
      hidden: ({ parent }: TextBlockDocument) => parent.isBigText,
    },
    {
      title: 'Eyebrow headline',
      name: 'eyebrow',
      description: 'A descriptive keyword, category or phrase that appears over the main headline.',
      options: {
        collapsible: true,
        collapsed: true,
      },
      hidden: ({ parent }: TextBlockDocument) => parent.isBigText,
    },
    {
      title: 'Call to action(s)',
      name: 'actions',
      options: {
        collapsible: true,
        collapsed: false,
      },
    },
    {
      name: 'design',
      title: 'Design options',
    },
    {
      name: 'anchor',
      title: 'Additional anchor point reference (Deprecated)',
      description:
        'If the anchor reference to this component is set using anchor link component, the value here will be overridden',
      options: {
        collapsible: true,
        collapsed: true,
      },
    },
  ],
  fields: [
    {
      title: 'Big text',
      name: 'isBigText',
      type: 'boolean',
    },
    {
      name: 'image',
      type: 'imageWithAlt',
      options: {
        hotspot: true,
      },
      fieldset: 'thumbnail',
    },
    {
      name: 'overline',
      title: 'Eyebrow',
      type: 'string',
      fieldset: 'eyebrow',
    },
    {
      name: 'title',
      type: 'array',
      components: {
        input: CompactBlockEditor,
      },
      of: [titleContentType],
      validation: (Rule: Rule) =>
        Rule.custom((value: PortableTextBlock[], ctx: ValidationContext) =>
          !value && !(ctx.parent as TextBlock)?.isBigText ? 'A title is recommended' : true,
        ).warning(),
      hidden: ({ parent }: TextBlockDocument) => parent.isBigText,
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
      name: 'ingress',
      title: 'Ingress',
      type: 'array',
      of: [ingressContentType],
      hidden: ({ parent }: TextBlockDocument) => parent.isBigText,
    },
    {
      name: 'bigTitle',
      title: 'Title',
      type: 'array',
      of: [blockContentTypeForBigText],
      hidden: ({ parent }: TextBlockDocument) => !parent.isBigText,
      validation: (Rule: Rule) =>
        Rule.custom((value: PortableTextBlock[], ctx: ValidationContext) =>
          !value && (ctx.parent as TextBlock)?.isBigText ? 'Title is required' : true,
        ),
    },
    {
      name: 'text',
      title: 'Text content',
      type: 'array',
      of: [blockContentType],
    },
    {
      name: 'action',
      type: 'array',
      title: 'Links and downloads',
      fieldset: 'actions',
      of: [
        { type: 'linkSelector', title: 'Link' },
        { type: 'downloadableImage', title: 'Call to action: Download image' },
        { type: 'downloadableFile', title: 'Call to action: Download file' },
      ],
    },
    {
      title: 'Display links as two columns',
      name: 'splitList',
      type: 'boolean',
      fieldset: 'actions',
      initialValue: false,
      description:
        'You can also display links/downloads as two columns if there are a lot of links. Ensure that titles are short enough to do this.',
    },
    {
      title: 'Use link style',
      name: 'overrideButtonStyle',
      type: 'boolean',
      fieldset: 'actions',
      initialValue: false,
      description:
        'You can override the default button style to link style. This can only be done if you have one link, and should be used with caution.',
      readOnly: ({ parent }: { parent: TextBlock }) => {
        return !(parent.action && parent?.action.length === 1)
      },
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
      ingress: 'ingress',
      text: 'text',
      isBigText: 'isBigText',
      bigTitle: 'bigTitle',
    },
    prepare({
      title,
      isBigText,
      bigTitle,
      ingress,
      text,
    }: {
      title: PortableTextBlock[]
      ingress: PortableTextBlock[]
      isBigText: boolean
      bigTitle: PortableTextBlock[]
      text: PortableTextBlock[]
    }) {
      const plainTitle = isBigText ? blocksToText(bigTitle) : blocksToText(title || ingress || text)

      return {
        title: plainTitle || 'Missing title/content',
        subtitle: isBigText ? 'Text block component (BIG TEXT)' : 'Text block component',
        media: EdsIcon(text_field),
      }
    },
  },
}
