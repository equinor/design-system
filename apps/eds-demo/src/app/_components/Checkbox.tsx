import type { Ref } from 'react'
import {
  checkbox,
  checkbox_indeterminate,
  checkbox_outline,
} from '@equinor/eds-icons'
import { classNames, type Styles } from './classNames'
import { Icon } from './Icon'

type CheckboxProps = {
  styles: Styles
  label: string
  checked: boolean
  indeterminate?: boolean
  onChange: () => void
  inputRef?: Ref<HTMLInputElement>
}

/** Checkbox without a visible label, as the EDS Checkbox in Figma draws it:
 * the EDS checkbox icons, with a native checkbox on top for keyboard,
 * screen readers and clicks. */
export function Checkbox({
  styles,
  label,
  checked,
  indeterminate = false,
  onChange,
  inputRef,
}: CheckboxProps) {
  const c = classNames(styles)
  const icon = indeterminate
    ? checkbox_indeterminate
    : checked
      ? checkbox
      : checkbox_outline

  return (
    <span
      className={c('checkbox')}
      data-checked={checked || indeterminate || undefined}
    >
      <input
        ref={inputRef}
        type="checkbox"
        className={c('checkbox-input')}
        checked={checked}
        onChange={onChange}
        aria-label={label}
      />
      <Icon data={icon} className={c('checkbox-icon')} />
    </span>
  )
}
