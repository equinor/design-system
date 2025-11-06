import {
  forwardRef,
  useState,
  useCallback,
  InputHTMLAttributes,
  CSSProperties,
} from 'react'
import { useToken, OverridableComponent } from '@equinor/eds-utils'
import { inputToken as tokens } from './Input.tokens'
import type { InputToken } from './Input.tokens'
import { useEds } from '../EdsProvider'
import type { InputProps } from './Input.new.types'
import './Input.new.css'

type ElementComponent = 'input' | 'textarea'

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
    const baseToken = useToken({ density }, inputVariant)() as InputToken

    const [leftAdornmentsRef, setLeftAdornmentsRef] = useState<HTMLDivElement>()
    const [rightAdornmentsRef, setRightAdornmentsRef] =
      useState<HTMLDivElement>()

    // Calculate spacings with adornment widths
    const token = useCallback((): InputToken => {
      const leftWidth =
        leftAdornmentsWidth ||
        (leftAdornmentsRef ? leftAdornmentsRef.clientWidth : 0)
      const rightWidth =
        rightAdornmentsWidth ||
        (rightAdornmentsRef ? rightAdornmentsRef.clientWidth : 0)

      return {
        ...baseToken,
        spacings: {
          ...baseToken.spacings,
          left: `${leftWidth + parseInt(baseToken.spacings.left)}px`,
          right: `${rightWidth + parseInt(baseToken.spacings.right)}px`,
        },
      }
    }, [
      leftAdornmentsWidth,
      leftAdornmentsRef,
      rightAdornmentsWidth,
      rightAdornmentsRef,
      baseToken,
    ])()

    // Container CSS variables
    // When disabled, only value and adornment colors change - placeholder stays normal
    const containerStyle: CSSProperties = {
      '--eds-input-adornment-color': disabled
        ? token.entities.adornment.states.disabled.typography.color
        : token.entities.adornment.typography.color,
      '--eds-input-color': disabled
        ? token.states.disabled.typography.color
        : token.typography.color,
      '--eds-input-placeholder-color': token.entities.placeholder.typography.color,
      '--eds-input-height': token.height,
      '--eds-input-width': token.width,
      '--eds-input-background': token.background,
      '--eds-input-box-shadow': token.boxShadow,
      '--eds-input-outline-width': token.outline.width,
      '--eds-input-outline-color': token.outline.color,
      '--eds-input-outline-style': token.outline.style,
      '--eds-input-outline-offset': token.outline.offset,
      '--eds-input-focus-outline-width': token.states.focus.outline.width,
      '--eds-input-focus-outline-color': token.states.focus.outline.color,
      '--eds-input-focus-outline-style': token.states.focus.outline.style,
      '--eds-input-focus-outline-offset': token.states.focus.outline.offset,
      '--eds-input-adornment-focus-color':
        token.entities.adornment?.states.focus?.outline.color,
      '--eds-input-readonly-background': token.states.readOnly.background,
      '--eds-input-readonly-box-shadow': token.states.readOnly.boxShadow,
    } as CSSProperties

    // Field typography and spacing
    const fieldStyle: CSSProperties = {
      fontFamily: token.typography.fontFamily,
      fontSize: token.typography.fontSize,
      fontWeight: token.typography.fontWeight,
      lineHeight: token.typography.lineHeight,
      paddingTop: token.spacings.top,
      paddingBottom: token.spacings.bottom,
      paddingLeft: token.spacings.left,
      paddingRight: token.spacings.right,
      resize: 'none',
    } as CSSProperties

    // Shared adornment styles
    const getAdornmentStyle = (side: 'left' | 'right'): CSSProperties => ({
      top: token.spacings.top,
      bottom: token.spacings.bottom,
      fontFamily: token.entities.adornment.typography.fontFamily,
      fontSize: token.entities.adornment.typography.fontSize,
      fontWeight: token.entities.adornment.typography.fontWeight,
      lineHeight: token.entities.adornment.typography.lineHeight,
      [side === 'left' ? 'paddingLeft' : 'paddingRight']:
        token.entities.adornment.spacings[side],
    })

    const containerClasses = [
      'eds-input',
      className,
      disabled && 'eds-input--disabled',
      readOnly && 'eds-input--readonly',
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div
        className={containerClasses}
        style={{ ...containerStyle, ...style }}
      >
        {leftAdornments && (
          <div
            {...leftAdornmentsProps}
            ref={setLeftAdornmentsRef}
            className="eds-adornment eds-adornment--left"
            style={getAdornmentStyle('left')}
          >
            {leftAdornments}
          </div>
        )}
        <ElementComponent
          ref={ref}
          type={ElementComponent === 'input' ? type : undefined}
          disabled={disabled}
          readOnly={readOnly}
          className="eds-field"
          style={fieldStyle}
          {...(other as any)}
        />
        {rightAdornments && (
          <div
            {...rightAdornmentsProps}
            ref={setRightAdornmentsRef}
            className="eds-adornment eds-adornment--right"
            style={getAdornmentStyle('right')}
          >
            {rightAdornments}
          </div>
        )}
      </div>
    )
  })
