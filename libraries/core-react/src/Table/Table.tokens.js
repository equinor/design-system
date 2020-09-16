import tableTokens from '@equinor/eds-tokens/components/table/table.json'

const { header, cell } = tableTokens

const variants = {
  header: { text: header.text },
  cell: {
    text: cell.text,
    numeric: cell.monospaced_numeric,
    icon: cell.icon,
    input: cell.input,
  },
}

export const getTokens = (as, variant) => {
  switch (as) {
    case 'th':
      return {
        ...variants.header[variant],
        // borders: {
        //   thead: variants.header[variant].borders,
        //   tbody: variants.cell[variant].borders,
        // },
        // background: {
        //   thead: variants.header[variant].background,
        //   tbody: variants.cell[variant].background,
        // },
      }
    case 'td':
    default:
      return variants.cell[variant]
  }
}
