import { dataset } from './datasetHelpers'
import { getLocaleFromName } from './localization'
import { defaultLanguage } from '../../languages'
import type { SanityDocument as DefaultSanityDocument } from 'sanity'

type SanityDocument = {
  _lang?: string | undefined
  slug?: {
    current?: string
  }
} & DefaultSanityDocument

export const getBaseUrl = (dataset: string): string => {
  const hostname = window.location.hostname

  if (hostname === 'localhost') return import.meta.env.SANITY_STUDIO_PROJECT_URL

  const env = window.location.hostname.includes('equinor-web-sites-preprod') ? 'preprod' : 'prod'

  switch (dataset) {
    case 'global':
      return `https://web-equinor-web-sites-${env}.c2.radix.equinor.com/`
    case 'global-development':
      return 'https://web-global-development-equinor-web-sites-dev.c2.radix.equinor.com'
    case 'global-test':
      return 'https://web-global-test-equinor-web-sites-test.c2.radix.equinor.com'
    default:
      return `https://web-${dataset}-equinor-web-sites-${env}.c2.radix.equinor.com`
  }
}

export const resolvePreviewUrl = (document: SanityDocument): string | false => {
  // Any random string, must match SANITY_PREVIEW_SECRET in the Next.js .env.local file
  const previewSecret = import.meta.env.SANITY_STUDIO_PREVIEW_SECRET

  if (!previewSecret) {
    console.warn('Missing preview secret')
    return false
  }

  if (!document._type || !document._id) {
    console.warn('The content needs an _id and _type before it can be previewed')
    return false
  }

  const previewUrl = new URL(getBaseUrl(dataset))
  const locale = getLocaleFromName(document?._lang) || defaultLanguage.locale

  previewUrl.pathname = '/api/preview'
  previewUrl.searchParams.append('type', document._type)
  previewUrl.searchParams.append('locale', locale)

  if (document?.slug?.current) {
    previewUrl.searchParams.append('slug', document?.slug?.current)
  } else {
    previewUrl.searchParams.append('id', document?._id)
  }

  previewUrl.searchParams.append('secret', previewSecret)

  return previewUrl.toString()
}
