import styled from 'styled-components'
import { tokens } from '@equinor/eds-tokens'
import {
  forwardRef,
  HTMLAttributes,
  KeyboardEvent,
  ReactNode,
  RefObject,
  useEffect,
} from 'react'
import { InputWrapper, InputWrapperProps } from '../../InputWrapper'
import { Popover } from '../../Popover'
import { useEds } from '../../EdsProvider'
import { GroupDOMAttributes } from '@react-types/shared'
import { filterDOMProps } from '@react-aria/utils'

const getVariant = (variant: InputWrapperProps['color']) => {
  if (variant === 'error') {
    return tokens.colors.interactive.danger__resting.rgba
  }
  if (variant === 'success') {
    return tokens.colors.interactive.success__resting.rgba
  }
  if (variant === 'warning') {
    return tokens.colors.interactive.warning__resting.rgba
  }
  return tokens.colors.interactive.primary__resting.rgba
}

const getVariantText = (variant: InputWrapperProps['color']) => {
  if (variant === 'error') {
    return tokens.colors.interactive.danger__text.rgba
  }
  if (variant === 'success') {
    return tokens.colors.interactive.success__text.rgba
  }
  if (variant === 'warning') {
    return tokens.colors.interactive.warning__text.rgba
  }
  return tokens.typography.input.text.color
}

const StyledInputFieldWrapper = styled.div<{
  $density: 'compact' | 'comfortable'
  $variant?: InputWrapperProps['color']
  $disabled: boolean
  $readonly: boolean
}>`
  display: flex;
  align-items: center;
  background-color: ${tokens.colors.ui.background__light.rgba};
  height: ${({ $density }) => ($density === 'compact' ? '24px' : '36px')};
  padding: 0 8px;
  ${({ $variant, $disabled, $readonly }) => {
    if (!$variant && !$readonly) {
      return `&:focus-within:not(.invalid) {
    outline: 2px solid
      ${tokens.colors.interactive.primary__resting.rgba};
  }

  ${
    !$disabled &&
    `&:not(:focus-within) {
    box-shadow: inset 0 -1px 0 0 ${tokens.colors.text.static_icons__tertiary.rgba};`
  }
  }
  `
    }
    return `outline: 2px solid ${getVariant($variant)};`
  }}

  ${({ $readonly }) => {
    return (
      $readonly &&
      `background-color: ${tokens.colors.ui.background__default.rgba};
      outline: none;`
    )
  }}

  color: ${(p) => getVariantText(p.$variant)};
  cursor: default;
`

type WrapperProps = {
  children: ReactNode
  color?: InputWrapperProps['color']
  disabled: boolean
  readonly: boolean
} & HTMLAttributes<HTMLDivElement>

/**
 * Applies styles around the date input fields (density, color etc.)
 */
export const InputFieldWrapper = forwardRef<HTMLDivElement, WrapperProps>(
  ({ children, color, disabled, readonly, ...props }, ref) => {
    const { density } = useEds()
    // As the props returned are designed for react-aria, some of them are not valid DOM props (i.e. onPress).
    // The filterDOMProps-method strips out the invalid props, but it also removes event listeners due to casing
    const filteredProps = filterDOMProps(props)
    // filterDOMProps also strips event handlers
    const eventHandlers = Object.keys(props)
      .filter((k) => k.startsWith('on'))
      .reduce(
        (a, b) => ({ ...a, [b]: props[b] as EventListener }),
        {},
      ) as Record<string, EventListener>
    return (
      <StyledInputFieldWrapper
        ref={ref}
        $density={density}
        $variant={color}
        $disabled={disabled ?? false}
        $readonly={readonly ?? false}
        {...filteredProps}
        {...eventHandlers}
      >
        {children}
      </StyledInputFieldWrapper>
    )
  },
)

type Props = {
  children: ReactNode
  isOpen: boolean | null
  setIsOpen: (open: boolean) => void
  label?: string
  calendar: ReactNode
  pickerRef: RefObject<HTMLDivElement>
  readonly: boolean
  extraProps?: GroupDOMAttributes
} & InputWrapperProps

export const FieldWrapper = forwardRef(
  (
    {
      children,
      pickerRef,
      calendar,
      isOpen,
      setIsOpen,
      label,
      readonly,
      ...props
    }: Props,
    ref: RefObject<HTMLDivElement>,
  ) => {
    useEffect(() => {
      if (isOpen === false) {
        // Focus the first segment in the input field
        const segment: HTMLDivElement = ref.current?.querySelector('.segment')
        segment?.focus()
      }
    }, [ref, isOpen, pickerRef])

    return (
      <>
        <InputWrapper
          readOnly={readonly}
          label={label}
          onKeyDownCapture={(event: KeyboardEvent<HTMLDivElement>) => {
            const isIconTarget = event.target instanceof SVGSVGElement
            if (
              !isIconTarget &&
              (event.code === 'Space' || event.code === 'Enter')
            ) {
              setIsOpen(true)
            }
          }}
          {...props}
        >
          {children}
        </InputWrapper>

        <Popover
          open={isOpen ?? false}
          onClose={() => setIsOpen(false)}
          anchorEl={ref.current}
          placement={'bottom-start'}
          withinPortal={true}
        >
          {calendar}
        </Popover>
      </>
    )
  },
)

InputFieldWrapper.displayName = 'InputFieldWrapper'
FieldWrapper.displayName = 'FieldWrapper'
