import {
  Combobox as BaseComponent,
  ComboboxProps,
  ComboboxChanges,
} from './Combobox'
import { ComboboxOption, ComboboxOptionProps } from './Option'

type ComboboxCompoundProps = typeof BaseComponent & {
  Option: typeof ComboboxOption
}

const Combobox = BaseComponent as ComboboxCompoundProps

Combobox.Option = ComboboxOption
Combobox.Option.displayName = 'Combobox.Option'

export { Combobox }
export type { ComboboxProps, ComboboxOptionProps, ComboboxChanges }
