// ISO dates are hard to type in ts apparently
export const formatDate = (isoDate: any): string => {
  const date = new Date(isoDate)
  const options = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  } as const
  const formattedDate = date.toLocaleDateString('en-UK', options) || ''
  return formattedDate
}
