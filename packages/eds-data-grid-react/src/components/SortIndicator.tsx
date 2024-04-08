import { Icon } from '@equinor/eds-core-react'
import { arrow_down, arrow_up } from '@equinor/eds-icons'
import { Column } from '@tanstack/react-table'

export const SortIndicator = <T,>({
  column,
}: {
  column: Column<T, unknown>
}) => {
  return (
    {
      asc: <Icon data={arrow_up} />,
      desc: <Icon data={arrow_down} />,
    }[column.getIsSorted() as string] ?? null
  )
}
