import { ReferenceBehavior } from '@sanity/document-internationalization'
import { languages, defaultLanguage } from '../languages'

export const i18n = {
  base: defaultLanguage.name,
  languages,
  fieldNames: {
    lang: '_lang',
    references: '_langRefs',
  },
  referenceBehavior: ReferenceBehavior.WEAK,
}
