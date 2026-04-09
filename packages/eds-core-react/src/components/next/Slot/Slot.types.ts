import type { HTMLAttributes, ReactNode } from 'react'

export type SlotProps = {
  children: ReactNode
} & HTMLAttributes<HTMLElement>
