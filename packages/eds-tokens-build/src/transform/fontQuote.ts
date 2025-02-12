import type { Transform } from 'style-dictionary/types'

export const FONT_QUOTE_NAME = 'eds/font/quote'

export const fontQuote: Transform = {
  type: `value`,
  transitive: false,
  name: FONT_QUOTE_NAME,
  filter: (token) => {
    const fontMetricsInString = ['font', 'family', 'weight', 'font-family']

    const isFontMetricInString =
      token?.path?.length > 0 &&
      fontMetricsInString.some((metric) => token.path.includes(metric))

    return isFontMetricInString
  },
  transform: (token) => {
    return `"${token.$value}"`
  },
}
