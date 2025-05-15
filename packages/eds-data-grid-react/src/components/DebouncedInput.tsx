/* istanbul ignore file */
import { ChangeEvent, InputHTMLAttributes, useEffect, useState } from 'react'
import {
  Autocomplete,
  InputWrapper,
  Input,
  Chip,
} from '@equinor/eds-core-react'

type Value = string | number | Array<string | number>
// File ignored, as relevant actions are covered via Filter.test.tsx
export function DebouncedInput({
  value: initialValue,
  values,
  onChange,
  debounce = 500,
  label,
  ...props
}: {
  value: Value
  values: Array<string | number>
  onChange: (value: Value) => void
  debounce?: number
  label?: string
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
    <>
      {props.type === 'number' ? (
        <InputWrapper label={props.placeholder}>
          <Input
            type={'number'}
            value={value}
            onChange={(e: ChangeEvent) =>
              setValue((e.target as HTMLInputElement).valueAsNumber)
            }
          />
        </InputWrapper>
      ) : (
        <>
          <Autocomplete
            options={values}
            autoWidth={true}
            multiple={true}
            optionComponent={(opt) =>
              opt === 'NULL_OR_UNDEFINED' ? '<Blank>' : opt
            }
            data-testid={'autocomplete'}
            /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
            label={`Select ${label ?? ''}`}
            placeholder={props.placeholder ?? 'Search'}
            selectedOptions={value as Array<string>}
            onOptionsChange={(c) => setValue(c.selectedItems)}
            multiline
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '8px' }}>
            {(value as Array<string>).map((v) => (
              <Chip
                title={v}
                onKeyDownCapture={(event) => {
                  if (['Backspace', 'Delete'].includes(event.key)) {
                    onChange(
                      (value as Array<string>).filter((item) => item !== v),
                    )
                  }
                }}
                style={{ margin: '4px' }}
                onDelete={() =>
                  onChange(
                    (value as Array<string>).filter((item) => item !== v),
                  )
                }
                key={v}
              >
                {v.slice(0, 20)}
                {v.length > 20 ? '...' : ''}
              </Chip>
            ))}
          </div>
        </>
      )}
    </>
  )
}
