import type { TransformedToken } from 'style-dictionary/types'

export const includeTokenFilter = (
  token: TransformedToken,
  filePathSegmentsToInclude?: string[],
  namesToExclude: string[] = [],
) => {
  // Join name to _namesToExclude
  const _namesToExclude = [
    'documentation',
    'padding-centred',
    'padding-baselined',
    'cap-height',
    'cap-rounded',
    'container',
    ...namesToExclude,
  ]

  const isExcluded = _namesToExclude.some((nameToExclude) =>
    token.name.includes(nameToExclude),
  )
  if (isExcluded) {
    return false
  }

  if (filePathSegmentsToInclude && filePathSegmentsToInclude.length > 0) {
    const isIncludingFilePathSegmentsToInclude = filePathSegmentsToInclude.some(
      (segment) => token.filePath.includes(segment),
    )
    return isIncludingFilePathSegmentsToInclude
  }

  return true
}
