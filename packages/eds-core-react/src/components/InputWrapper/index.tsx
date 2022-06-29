import {
  InputWrapper as BaseComponent,
  Adornments,
  InputWrapperProps,
} from './InputWrapper'

type InputWrapperCompoundProps = typeof BaseComponent & {
  Adornments: typeof Adornments
}

const InputWrapper = BaseComponent as InputWrapperCompoundProps

InputWrapper.Adornments = Adornments

InputWrapper.Adornments.displayName = 'InputWrapper.Adornments'

export { InputWrapper }
export type { InputWrapperProps }
