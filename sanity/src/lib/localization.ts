import { languages, defaultLanguage } from '../../languages'

export const getLocaleFromName = (name: string | undefined): string => {
  return languages.find((lang) => lang.name === name)?.locale || defaultLanguage.locale
}
