import { ValidationContext } from 'sanity'
import { apiVersion } from '../../sanity.client'
import { Flags } from '../../src/lib/datasetHelpers'

const validateIsUniqueWithinLocale = async (slug: string, context: ValidationContext) => {
  const { document, getClient } = context

  if (!document) return

  const baseId = document._id.replace('drafts.', '').substring(0, 36)

  let query: string

  if (document._type.includes('route')) {
    query = /* groq */ `*[slug.current == $slug && _type == $type && !(_id match $baseId + "*") && !(_id in path("drafts.**"))]`
  } else {
    query = /* groq */ `*[slug.current == $slug && !(_id match $baseId + "*") && !(_id in path("drafts.**"))]`
  }

  const params = { type: document._type, baseId, slug }
  const matchingSlugs = await getClient({ apiVersion: apiVersion }).fetch(query, params)

  return matchingSlugs.length === 0
}

export const withSlugValidation = (options: any) => {
  return Flags.HAS_SAME_SLUG
    ? {
        ...options,
        isUnique: validateIsUniqueWithinLocale,
      }
    : options
}
