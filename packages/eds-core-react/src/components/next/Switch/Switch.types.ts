import { InputHTMLAttributes } from 'react'

export type SwitchProps = {
    /** Label for the switch */
    label?: string
    /** If true, the switch will be disabled */
    disabled?: boolean
    /** If true, the switch will be checked */
    checked?: boolean
    /** Callback when the switch state changes */
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
    /** Color appearance of the switch */
    color?: 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'color'>
