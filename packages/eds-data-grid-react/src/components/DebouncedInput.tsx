/* istanbul ignore file */
import { ChangeEvent, InputHTMLAttributes, useEffect, useState } from 'react'
import { Autocomplete, EdsProvider, Input } from '@equinor/eds-core-react'

type Value = string | number | Array<string | number>
// File ignored, as relevant actions are covered via Filter.test.tsx
export function DebouncedInput({
  value: initialValue,
  values,
  onChange,
  debounce = 500,
  ...props
}: {
  value: Value
  values: Array<string | number>
  onChange: (value: Value) => void
  debounce?: number
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = useState<Value>(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <EdsProvider density="compact">
      {props.type === 'number' ? (
        <Input
          type={'number'}
          placeholder={props.placeholder ?? 'Search'}
          value={value}
          onChange={(e: ChangeEvent) =>
            setValue((e.target as HTMLInputElement).valueAsNumber)
          }
        />
      ) : (
        <Autocomplete
          options={values}
          multiple={true}
          optionComponent={(opt) => String(opt || '<Blank>')}
          data-testid={'autocomplete'}
          /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
          // @ts-ignore
          label={null}
          placeholder={props.placeholder ?? 'Search'}
          onOptionsChange={(c) => setValue(c.selectedItems)}
        />
      )}
    </EdsProvider>
  )
}
