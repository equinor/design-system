import * as React from 'react'
import { forwardRef, SelectHTMLAttributes } from 'react'
import styled from 'styled-components'
import { Label } from '../../Label'
import { Select } from './Select'

const Container = styled.div`
  min-width: 100px;
  width: 100%;
`

export type NativeSelectProps = {
  /** Input unique id */
  id: string
  /** Label for the select element */
  label: string
  /** Meta text, for instance unit */
  meta?: string
  /** Disabled state */
  disabled?: boolean
  /** The user can choose multiple items */
  multiple?: boolean
  /** Ref for the select element */
  selectRef?: React.Ref<HTMLSelectElement>
} & SelectHTMLAttributes<HTMLSelectElement>

export const NativeSelect = forwardRef<HTMLDivElement, NativeSelectProps>(
  function NativeSelect(
    {
      label,
      children,
      className,
      selectRef,
      id,
      meta,
      disabled = false,
      multiple = false,
      ...other
    },
    ref,
  ) {
    const containerProps = {
      ref,
      className,
    }

    const selectProps = {
      ref: selectRef,
      id,
      disabled,
      multiple,
      ...other,
    }

    const labelProps = {
      inputId: id,
      label,
      meta,
    }

    const showLabel = label || meta

    return (
      <Container {...containerProps}>
        {showLabel && <Label {...labelProps} />}
        <Select {...selectProps}>{children}</Select>
      </Container>
    )
  },
)
