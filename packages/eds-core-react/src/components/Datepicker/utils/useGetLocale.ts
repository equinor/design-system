import { useLocale } from 'react-aria'

export const useGetLocale = (locale?: string) => {
  const { locale: currentLocale } = useLocale()
  // Priority:
  // 1. Explicitly passed locale prop
  // 2. Locale from I18nProvider
  // 3. Fallback to browser's default
  const browserLocale = new Intl.DateTimeFormat().resolvedOptions().locale
  return locale ?? currentLocale ?? browserLocale
}
