import type { InputHTMLAttributes, ReactNode } from 'react'

export type SwitchProps = {
  /**
   * Visible label for the switch (required).
   */
  label: ReactNode
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>
