import { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'outline' | 'ghost'
export type ButtonSize = 'small' | 'default' | 'large'
export type ButtonColorAppearance = 'accent' | 'neutral' | 'danger'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** Button variant */
    variant?: ButtonVariant
    /** Button size */
    size?: ButtonSize
    /** Color appearance for the button */
    colorAppearance?: ButtonColorAppearance
    /** Icon to display before the label */
    iconStart?: ReactNode
    /** Icon to display after the label */
    iconEnd?: ReactNode
    /** Content to display inside the button */
    children?: ReactNode
}
