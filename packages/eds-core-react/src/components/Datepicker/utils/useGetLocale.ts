import { useLocale } from 'react-aria'

export const useGetLocale = (locale?: string) => {
  const { locale: externalLocale } = useLocale()
  // react-aria defaults to navigator.language if no locale is provided. If these are equal, we override by using the system default locale
  const defaultLocale = navigator.language
  const fallbackLocale = new Intl.DateTimeFormat().resolvedOptions().locale
  return (
    locale ??
    (externalLocale === defaultLocale ? undefined : externalLocale) ??
    fallbackLocale
  )
}
