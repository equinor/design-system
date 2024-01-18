import { attach_file, external_link, link } from '@equinor/eds-icons'
import type { BlockDefinition, Rule, ValidationContext } from 'sanity'
import { filterByPages, filterByPagesInOtherLanguages } from '../../helpers/referenceFilters'
import { EdsBlockEditorIcon, EdsIcon, IconSubScript, IconSuperScript } from '../../icons'
import { Flags } from '../../src/lib/datasetHelpers'
import { ExternalLinkRenderer, SubScriptRenderer, SuperScriptRenderer } from '../components'
import routes from '../routes'

export type BlockContentProps = {
  h1?: boolean
  h2?: boolean
  h3?: boolean
  h4?: boolean
  internalLink?: boolean
  externalLink?: boolean
  attachment?: boolean
  lists?: boolean
  smallText?: boolean
  normalTextOverride?: {
    title: string
    value: 'normal'
    component?: ({ children }: { children: React.ReactNode }) => JSX.Element
  }
}
const SmallTextRender = (props: any) => {
  const { children } = props
  return <span style={{ fontSize: '0.8rem' }}>{children}</span>
}

export const configureBlockContent = (options: BlockContentProps = {}): BlockDefinition => {
  const {
    h1 = false,
    h2 = true,
    h3 = true,
    h4 = false,
    internalLink = true,
    externalLink = true,
    attachment = false,
    lists = true,
    smallText = true,
    normalTextOverride = { title: 'Normal', value: 'normal' },
  } = options

  const config: BlockDefinition = {
    type: 'block',
    name: 'block',
    styles: [normalTextOverride],
    lists: lists
      ? [
          { title: 'Numbered', value: 'number' },
          { title: 'Bullet', value: 'bullet' },
        ]
      : [],
    marks: {
      decorators: [
        // @TODO: Strong and Em are built in and not needed
        { title: 'Strong', value: 'strong' },
        { title: 'Emphasis', value: 'em' },
        {
          title: 'Sub',
          value: 'sub',
          icon: IconSubScript,
          component: SubScriptRenderer,
        },
        {
          title: 'Super',
          value: 'sup',
          icon: IconSuperScript,
          component: SuperScriptRenderer,
        },
      ],
      annotations: [],
    },
  }

  const h1Config = { title: 'Title (h1)', value: 'h1' }
  const h2Config = { title: 'Title (h2)', value: 'h2' }
  const h3Config = { title: 'Subtitle (h3)', value: 'h3' }
  const h4Config = { title: 'Subtitle (h4)', value: 'h4' }
  const smallTextConfig = {
    title: 'Small text',
    value: 'smallText',
    component: SmallTextRender,
  }

  const externalLinkConfig = {
    name: 'link',
    type: 'object',
    title: 'External link',
    icon: () => EdsBlockEditorIcon(external_link),
    component: ExternalLinkRenderer,
    fields: [
      {
        name: 'href',
        type: 'url',
        validation: (Rule: any) => Rule.uri({ scheme: ['http', 'https', 'tel', 'mailto'] }),
      },
    ],
  }

  type ReferenceType = {
    _ref: string
    _type: 'reference'
  }

  type InternalLinkType = {
    linkToOtherLanguage: boolean
    reference: ReferenceType
    referenceToOtherLangs: ReferenceType
  }

  type ReferenceTarget = {
    type: string
  }

  const types = [
    Flags.HAS_NEWS && {
      type: 'news',
    },
    Flags.HAS_LOCAL_NEWS && {
      type: 'localNews',
    },
    Flags.HAS_MAGAZINE && {
      type: 'magazine',
    },
  ].filter((e) => e)
  const defaultReferenceTargets: ReferenceTarget[] = [...(types as ReferenceTarget[]), ...routes]

  const internalLinkConfig = {
    name: 'internalLink',
    type: 'object',
    title: 'Internal link',
    icon: () => EdsBlockEditorIcon(link),
    fields: [
      {
        name: 'linkToOtherLanguage',
        type: 'boolean',
        title: 'Link to a different language',
        description: 'Use this if you want to create a link to a page of a different language',
      },
      {
        title: 'Reference',
        name: 'reference',
        type: 'reference',
        to: defaultReferenceTargets,
        options: {
          filter: filterByPages,
          disableNew: true,
        },
        hidden: ({ parent }: { parent: InternalLinkType }) => parent.linkToOtherLanguage,
        validation: (Rule: Rule) =>
          Rule.custom((value: ReferenceType, context: ValidationContext) => {
            const { parent } = context as { parent: InternalLinkType }
            if (parent.linkToOtherLanguage || value?._ref) {
              return true
            } else {
              return 'Field is required'
            }
          }),
      },
      {
        title: 'Reference',
        // Oh no! There is a typo here :(
        name: 'referenceToOtherLanguange',
        type: 'reference',
        to: defaultReferenceTargets,
        options: {
          filter: filterByPagesInOtherLanguages,
          disableNew: true,
        },
        hidden: ({ parent }: { parent: InternalLinkType }) => !parent.linkToOtherLanguage,
        validation: (Rule: Rule) =>
          Rule.custom((value: ReferenceType, context: ValidationContext) => {
            const { parent } = context as { parent: InternalLinkType }
            if (!parent.linkToOtherLanguage || value?._ref) {
              return true
            } else {
              return 'Field is required'
            }
          }),
      },
      {
        name: 'anchorReference',
        title: 'Anchor reference',
        type: 'anchorReferenceField',
        description: 'Use this field to link to an anchor point on the page you are linking to.',
      },
    ],
    options: {
      modal: {
        width: 'medium',
      },
    },
  }

  const attachmentConfig = {
    name: 'attachment',
    type: 'object',
    title: 'Attachment',
    icon: () => EdsIcon(attach_file),
    fields: [
      {
        name: 'reference',
        type: 'reference',
        to: [{ type: 'downloadableFile' }],
      },
    ],
  }

  if (h1) {
    config?.styles?.push(h1Config)
  }

  if (h2) {
    config?.styles?.push(h2Config)
  }

  if (h3) {
    config?.styles?.push(h3Config)
  }

  if (h4) {
    config?.styles?.push(h4Config)
  }
  if (smallText) {
    config?.styles?.push(smallTextConfig)
  }

  if (externalLink) {
    config?.marks?.annotations?.push(externalLinkConfig)
  }

  if (internalLink) {
    config?.marks?.annotations?.push(internalLinkConfig)
  }

  if (attachment) {
    config?.marks?.annotations?.push(attachmentConfig)
  }

  return config
}

export default configureBlockContent()
