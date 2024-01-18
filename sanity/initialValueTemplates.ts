import { Template } from 'sanity'
import { languages } from './languages'
import textSnippets from './schemas/textSnippets'
import { Flags } from './src/lib/datasetHelpers'

const ParentRoutesTemplates: Template<any, any>[] = languages.map(({ name, title }) => ({
  id: `parent-route-${name}`,
  title: `Parent route - ${title}`,
  schemaType: `route_${name}`,
  parameters: [{ name: 'parentId', type: 'string' }],
  value: (params: Record<string, unknown>) => ({ parent: { _type: 'reference', _ref: params.parentId } }),
}))

const TextSnippetsTemplates: Template<any, any>[] = Object.keys(textSnippets).map((key) => ({
  id: `text-snippet-${key}`,
  title: `Text Snippet - ${textSnippets[key].title}`,
  schemaType: `textSnippet`,
  parameters: [{ name: 'defaultValue', type: 'string' }],
  value: (params: Record<string, unknown>) => {
    const fields = languages.map(({ name }) => ({ [name]: params.defaultValue }))
    return Object.assign({}, ...fields)
  },
}))

const MenuTemplates: Template<any, any>[] = Flags.HAS_FANCY_MENU
  ? [
      {
        id: 'menu-with-locale',
        title: 'Site menu',
        schemaType: 'siteMenu',
        parameters: [{ name: 'isoCode', type: 'string' }],
        value: (params: Record<string, unknown>) => ({
          _lang: params.isoCode,
        }),
      },
      {
        id: 'submenu-with-locale',
        title: 'Sub menu',
        schemaType: 'siteMenu',
        parameters: [{ name: 'isoCode', type: 'string' }],
        value: (params: Record<string, unknown>) => ({
          _lang: params.isoCode,
        }),
      },
    ]
  : [
      {
        id: 'simple-menu-with-locale',
        title: 'Site menu (simple)',
        schemaType: 'simpleMenu',
        parameters: [{ name: 'isoCode', type: 'string' }],
        value: (params: Record<string, unknown>) => ({
          _lang: params.isoCode,
        }),
      },
    ]

const footerWithLocaleTemplate: Template<any, any> = {
  id: 'footer-with-locale',
  title: 'Footer',
  schemaType: 'footer',
  parameters: [{ name: 'isoCode', type: 'string' }],
  value: (params: Record<string, unknown>) => ({
    _lang: params.isoCode,
  }),
}

const redirectWithLocaleTemplate: Template<any, any> = {
  id: 'redirect-with-locale',
  title: 'Redirect',
  schemaType: 'redirect',
  parameters: [{ name: 'isoCode', type: 'string' }],
  value: (params: Record<string, unknown>) => ({
    _lang: params.isoCode,
  }),
}

const localNewsWithTagTemplate: Template<any, any> = {
  id: 'localnews-with-tag',
  title: 'Local news',
  schemaType: 'localNews',
  parameters: [{ name: 'localNewsTag', type: 'reference' }],
  value: (params: Record<string, unknown>) => ({
    localNewsTag: params.localNewsTag,
  }),
}

export const initialValueTemplates = [
  //promotedMagazineTagTemplate,
  localNewsWithTagTemplate,
  redirectWithLocaleTemplate,
  footerWithLocaleTemplate,
  ...MenuTemplates,
  ...TextSnippetsTemplates,
  ...ParentRoutesTemplates,
]
