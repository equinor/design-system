import {
  ReactNode,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  forwardRef,
  Ref,
} from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { Field } from './Field'
import { Label } from '../Label'
import { HelperText } from './HelperText'
import { TextFieldProvider } from './TextField.context'
import { InputWrapper } from '../InputWrapper'
import { Input, InputProps } from '../Input'
import type { Variants } from './types'
import { textfield as tokens } from './TextField.tokens'
import { useToken, useId } from '@equinor/eds-utils'
import { useEds } from '../EdsProvider'
import { Textarea } from '../Textarea'

const Container = styled.div`
  min-width: 100px;
  width: 100%;
`

export type TextFieldProps = {
  /** @ignore */
  className?: string
  /** Variants */
  variant?: Variants
  /** Input unique id */
  id: string
  /** Label text */
  label?: string
  /** Meta text */
  meta?: string
  /** Unit text */
  unit?: string
  /** Helper text */
  helperText?: string
  /** Placeholder text */
  placeholder?: string
  /** Disabled */
  disabled?: boolean
  /** Multiline input */
  multiline?: boolean
  /** Specifies max rows for multiline input */
  rowsMax?: number
  /** Input ref */
  inputRef?: Ref<HTMLInputElement>
  /** InputIcon */
  inputIcon?: ReactNode
  /** HelperIcon */
  helperIcon?: ReactNode
  /** Value */
  value?: string
  /** Read Only */
  readOnly?: boolean
} & InputHTMLAttributes<HTMLInputElement>

export const TextField = forwardRef<HTMLDivElement, TextFieldProps>(
  function TextField(
    {
      id,
      label,
      meta,
      unit,
      helperText,
      placeholder,
      disabled,
      multiline,
      className,
      variant = 'default',
      inputRef,
      inputIcon,
      helperIcon,
      rowsMax,
      style,
      ...other
    },
    ref,
  ) {
    const helperTextId = useId(null, 'helpertext')
    const inputProps: InputProps = {
      'aria-describedby': helperTextId,
      disabled,
      placeholder,
      id,
      variant,

      rightAdornments: (
        <>
          {inputIcon}
          {unit}
        </>
      ),
      ...other,
    }

    const helperProps = {
      id: helperTextId,
      variant,
      helperText,
      icon: helperIcon,
      disabled,
    }

    const containerProps = {
      ref,
      className,
      style,
    }

    const labelProps = {
      htmlFor: id,
      label,
      meta,
      disabled,
    }

    const showLabel = label || meta
    const showHelperText = helperText

    const { density } = useEds()
    const token = useToken({ density }, tokens)

    return (
      <ThemeProvider theme={token}>
        {/* <Container {...containerProps}>
          <TextFieldProvider>
            {showLabel && <Label {...labelProps} />}
            <Field {...inputProps} />
            {showHelperText && <HelperText {...helperProps} />}
          </TextFieldProvider>
        </Container> */}

        <InputWrapper helperProps={helperProps} labelProps={labelProps}>
          {multiline ? <Textarea /> : <Input ref={inputRef} {...inputProps} />}
        </InputWrapper>
      </ThemeProvider>
    )
  },
)
