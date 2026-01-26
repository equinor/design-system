import type { InputHTMLAttributes, ReactNode } from 'react'

export type RadioProps = {
  /** Label for the radio button */
  label?: ReactNode
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>
