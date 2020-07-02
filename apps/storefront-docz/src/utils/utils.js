export const kebabify = (str) => str.toLowerCase().split(' ').join('-')

export const camelify = (str) =>
  str
    .toLowerCase()
    .split(' ')
    .map((word, index) =>
      index > 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word,
    )
    .join('')

export const slugify = (str) => {
  if (!str) return
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z ]/g, '')
    .split(' ')
    .join('-')
}
