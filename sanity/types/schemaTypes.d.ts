/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
export interface Preview {
  title: string
  subtitle: string
  media: JSX.Element
}

export type ValidationContext = {
  document: { [key: string]: any }
  parent: { [key: string]: any }
  path: string[]
}

export type ValidationResult = true | string | Promise<true | string>

export interface ValidationRule {
  required: () => ValidationRule
  custom: (value: any, context?: ValidationContext) => ValidationResult | warning
  min: (arg0: number) => ValidationRule
  max: (arg0: number) => ValidationRule
  error: (arg0: string) => ValdiationRule
  warning: (arg0: string) => ValidationRule
  [x: string]: any
}

export interface ReferenceFilter {
  filter: string // GROQ filter string
  params: { [x: string]: any }
}
