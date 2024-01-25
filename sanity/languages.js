import { getLanguages } from './satellitesConfig'
import { dataset } from './sanity.client'

export const languages = getLanguages(dataset)

export const defaultLanguage = languages[0]
