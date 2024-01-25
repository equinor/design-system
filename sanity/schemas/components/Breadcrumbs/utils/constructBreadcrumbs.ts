import { parseSlug } from './parseSlug'

export const constructBreadcrumbs = (prefix: string, slug: string, inputs: string[] = []) => {
  if (inputs && inputs.length > 0) {
    return [parseSlug(prefix), ...inputs.map((item: string) => parseSlug(item)), parseSlug(slug)]
  }

  const current = slug.split('/').filter((e) => e)
  return [parseSlug(prefix), ...current.map((item: string) => parseSlug(item))]
}
