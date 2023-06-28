import { CellContext, ColumnDef } from '@tanstack/react-table'

type Cargo = any

export const columns: Array<ColumnDef<Cargo, any>> = [
  {
    accessorKey: 'cargoId',
    id: 'cargoId',
    header: (ctx) => (
      <button onClick={() => ctx.column.toggleVisibility(false)}>
        Cargo id
      </button>
    ),
    cell: (info) => info.getValue(),
    footer: (props) => props.column.id,
    size: 100,
  },
  {
    accessorKey: 'qty',
    id: 'numeric',
  },
  {
    accessorKey: 'status',
    header: () => 'Status',
    filterFn: 'auto',
    size: 100,
    id: 'status',
  },
  {
    accessorKey: 'parcels',
    enableColumnFilter: false,
    header: () => 'Parcels',
    cell: (info: CellContext<Cargo, 'parcels'>) => (
      <span>{info.getValue().length}</span>
    ),
    footer: (props) => props.column.id,
  },
  {
    accessorKey: 'carrier',
    header: 'Carrier',
    footer: (props) => props.column.id,
  },
]
