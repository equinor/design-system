import type { InputHTMLAttributes, ReactNode } from 'react'

export type RadioProps = {
  /** Label for the radio button */
  label?: ReactNode
  /** Custom class name, merged onto the native input element together with
   * the internal 'input' class */
  className?: string
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>
