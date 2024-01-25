export const parseSlug = (item: string) => {
  const parts = item.split('/').at(-1) || item
  return parts[0].toUpperCase() + parts.slice(1)
}
