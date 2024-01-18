export const validateCharCounterEditor = (value: PortableTextBlock[], charLimit: number) => {
  if (!value || value.length === 0) {
    return 'Required'
  }

  const count = value[0].children.reduce(
    (total: any, current: { text: string | any[] }) => total + current.text.length,
    0,
  )

  if (count > charLimit) {
    return `The introduction should be no longer than ${charLimit} characters. Currently ${count} characters long.`
  }

  return true
}
