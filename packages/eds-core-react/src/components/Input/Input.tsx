import {
  forwardRef,
  ReactNode,
  useState,
  useCallback,
  CSSProperties,
  ElementType,
  ComponentPropsWithoutRef,
  InputHTMLAttributes,
} from 'react'
import { useToken, OverridableComponent } from '@equinor/eds-utils'
import { inputToken as tokens } from './Input.tokens'
import type { InputToken } from './Input.tokens'
import type { Variants } from '../types'
import { useEds } from '../EdsProvider'
import './Input.css'
export type InputProps = {
  /** Placeholder */
  placeholder?: string
  /** Variant */
  variant?: Variants
  /** Disabled state */
  disabled?: boolean
  /** Type */
  type?: string
  /** Read Only */
  readOnly?: boolean
  /** Left adornments */
  leftAdornments?: ReactNode
  /** Right adornments */
  rightAdornments?: ReactNode
  /** Left adornments props */
  leftAdornmentsProps?: ComponentPropsWithoutRef<'div'>
  /** Right adornments props */
  rightAdornmentsProps?: ComponentPropsWithoutRef<'div'>
  /** Manually specify left adornments width. The width will be the dom element width if not defined */
  leftAdornmentsWidth?: number
  /**  Manually specify right adornments width. The width will be the dom element width if not defined */
  rightAdornmentsWidth?: number
  /** Cast the input to another element */
  as?: ElementType
  /**  */
  className?: string
  style?: CSSProperties
}

export const Input: OverridableComponent<InputProps, HTMLInputElement> =
  forwardRef<
    HTMLInputElement,
    InputProps & InputHTMLAttributes<HTMLInputElement>
  >(function Input(
    {
      variant,
      disabled = false,
      type = 'text',
      leftAdornments,
      rightAdornments,
      readOnly,
      className,
      style,
      leftAdornmentsProps,
      rightAdornmentsProps,
      leftAdornmentsWidth,
      rightAdornmentsWidth,
      as: ElementComponent = 'input',
      ...other
    },
    ref,
  ) {
    const inputVariant = tokens[variant] ? tokens[variant] : tokens.input
    const { density } = useEds()
    const _token = useToken({ density }, inputVariant)() as InputToken

    const [rightAdornmentsRef, setRightAdornmentsRef] =
      useState<HTMLDivElement>()
    const [leftAdornmentsRef, setLeftAdornmentsRef] = useState<HTMLDivElement>()

    const token = useCallback((): InputToken => {
      const _leftAdornmentsWidth =
        leftAdornmentsWidth ||
        (leftAdornmentsRef ? leftAdornmentsRef.clientWidth : 0)
      const _rightAdornmentsWidth =
        rightAdornmentsWidth ||
        (rightAdornmentsRef ? rightAdornmentsRef.clientWidth : 0)
      return {
        ..._token,
        spacings: {
          ..._token.spacings,
          left: `${_leftAdornmentsWidth + parseInt(_token.spacings.left)}px`,
          right: `${_rightAdornmentsWidth + parseInt(_token.spacings.right)}px`,
        },
      }
    }, [
      leftAdornmentsWidth,
      leftAdornmentsRef,
      rightAdornmentsWidth,
      rightAdornmentsRef,
      _token,
    ])()

    const { states, entities } = token

    // Build focus state data for CSS custom properties
    const focusOutline = states.focus.outline
    const focusAdornmentColor = entities.adornment?.states.focus?.outline.color

    // Build container styles
    const containerStyles: CSSProperties = {
      '--eds-input-adornment-color': entities.adornment.typography.color,
      '--eds-input-color': token.typography.color,
      '--placeholder-color': entities.placeholder.typography.color,
      '--focus-outline-width': focusOutline.width,
      '--focus-outline-style': focusOutline.style,
      '--focus-outline-color': focusOutline.color,
      '--focus-outline-offset': focusOutline.offset,
      '--focus-adornment-color': focusAdornmentColor,
      height: token.height,
      width: token.width,
      boxShadow: token.boxShadow,
      background: `var(--eds-input-background, ${token.background})`,
      outline: `${token.outline.width} ${token.outline.style} ${token.outline.color}`,
      outlineOffset: token.outline.offset,
      ...style,
    } as CSSProperties

    if (disabled) {
      containerStyles['--eds-input-adornment-color'] =
        states.disabled.typography.color
      containerStyles['--eds-input-color'] = states.disabled.typography.color
    }

    if (readOnly) {
      containerStyles.background = states.readOnly.background
      containerStyles.boxShadow = states.readOnly.boxShadow
    }

    // Build input field styles
    const inputTypography = token.typography
    const inputStyles: CSSProperties = {
      paddingTop: token.spacings.top,
      paddingBottom: token.spacings.bottom,
      paddingLeft: token.spacings.left,
      paddingRight: token.spacings.right,
      margin: 0,
      color: inputTypography.color,
      fontFamily: inputTypography.fontFamily,
      fontSize: inputTypography.fontSize,
      fontWeight: inputTypography.fontWeight,
      lineHeight: inputTypography.lineHeight,
    }

    if (inputTypography.fontStyle) {
      inputStyles.fontStyle = inputTypography.fontStyle
    }
    if (inputTypography.letterSpacing) {
      inputStyles.letterSpacing = inputTypography.letterSpacing
    }
    if (inputTypography.textTransform) {
      inputStyles.textTransform = inputTypography.textTransform as CSSProperties['textTransform']
    }

    // Build adornments typography styles
    const adornmentTypography = entities.adornment.typography
    const adornmentTypographyStyles: CSSProperties = {
      margin: 0,
      color: adornmentTypography.color,
      fontFamily: adornmentTypography.fontFamily,
      fontSize: adornmentTypography.fontSize,
      fontWeight: adornmentTypography.fontWeight,
      lineHeight: adornmentTypography.lineHeight,
    }

    if (adornmentTypography.fontStyle) {
      adornmentTypographyStyles.fontStyle = adornmentTypography.fontStyle
    }
    if (adornmentTypography.letterSpacing) {
      adornmentTypographyStyles.letterSpacing =
        adornmentTypography.letterSpacing
    }

    // Build left adornments styles
    const leftAdornmentsStyles: CSSProperties = {
      top: token.spacings.top,
      bottom: token.spacings.bottom,
      paddingLeft: entities.adornment.spacings.left,
      ...adornmentTypographyStyles,
    }

    // Build right adornments styles
    const rightAdornmentsStyles: CSSProperties = {
      top: token.spacings.top,
      bottom: token.spacings.bottom,
      paddingRight: entities.adornment.spacings.right,
      ...adornmentTypographyStyles,
    }

    return (
      <div
        className={`eds-input ${disabled ? 'eds-disabled' : ''} ${readOnly ? 'eds-readonly' : ''} ${className || ''}`}
        style={containerStyles}
      >
        {leftAdornments ? (
          <div
            {...leftAdornmentsProps}
            ref={setLeftAdornmentsRef}
            className="eds-adornment eds-left"
            style={{
              ...leftAdornmentsStyles,
              ...leftAdornmentsProps?.style,
            }}
          >
            {leftAdornments}
          </div>
        ) : null}
        <ElementComponent
          ref={ref}
          type={type}
          disabled={disabled}
          readOnly={readOnly}
          className="eds-field"
          style={inputStyles}
          {...other}
        />
        {rightAdornments ? (
          <div
            {...rightAdornmentsProps}
            ref={setRightAdornmentsRef}
            className="eds-adornment eds-right"
            style={{
              ...rightAdornmentsStyles,
              ...rightAdornmentsProps?.style,
            }}
          >
            {rightAdornments}
          </div>
        ) : null}
      </div>
    )
  })
