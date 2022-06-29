import { HTMLAttributes, forwardRef, ReactElement } from 'react'
import styled, { css, ThemeProvider } from 'styled-components'
import { Label } from '../Label'
import { HelperText } from './HelperText'
import { useEds } from './../EdsProvider'
import { inputToken } from './InputWrapper.tokens'
import {
  outlineTemplate,
  useToken,
  spacingsTemplate,
  typographyTemplate,
} from '@equinor/eds-utils'

const Container = styled.div`
  display: grid;
  gap: 8px;
`

const Field = styled.div(({ theme }) => {
  const {
    states: {
      focus: { outline: focusOutline },
      active: { outline: activeOutline },
      disabled,
      readOnly,
    },
    boxShadow,
  } = theme

  return css`
    display: flex;
    flex-direction: row;
    column-gap: 8px;
    background: ${theme.background};
    height: ${theme.minHeight};
    box-shadow: ${boxShadow};

    &:focus-within {
      ${outlineTemplate(focusOutline)}
      box-shadow: none;
    }
  `
})

export const Adornments = styled.div(({ theme }) => {
  return css`
    display: flex;
    column-gap: 8px;
    justify-content: center;
    align-items: center;
    width: fit-content;

    ${spacingsTemplate(theme.spacings)}
    ${typographyTemplate(theme.entities.adornment.typography)}
  `
})

export type InputWrapperProps = {
  /** Label */
  label: string
  /** Meta */
  meta: string
  /** Disabled state */
  disabled?: boolean
  /** Read Only */
  readOnly?: boolean
  /** Helper text icon */
  helperIcon?: ReactElement
  /** Helper text */
  helperText?: string
} & HTMLAttributes<HTMLDivElement>

export const InputWrapper = forwardRef<HTMLDivElement, InputWrapperProps>(
  function InputWrapper(
    {
      disabled,
      readOnly,
      label,
      meta,
      children,
      helperIcon,
      helperText,
      ...other
    },
    ref,
  ) {
    const { density } = useEds()
    const token = inputToken.input

    return (
      <ThemeProvider theme={token}>
        <Container {...other} ref={ref}>
          <Label label={label} meta={meta} />
          <Field tabIndex={0}>{children}</Field>
          <HelperText icon={helperIcon} text={helperText}></HelperText>
        </Container>
      </ThemeProvider>
    )
  },
)
