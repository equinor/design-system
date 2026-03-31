import { forwardRef, useEffect, useRef, useMemo, useState } from 'react'
import { mergeRefs, useAutoResize } from '@equinor/eds-utils'
import { info_circle } from '@equinor/eds-icons'
import type { TextAreaProps } from './TextArea.types'
import { Field, useFieldIds } from '../Field'
import { Input } from '../Input'
import { Button } from '../Button'
import { Tooltip } from '../../Tooltip'
import { Icon } from '../Icon'

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea(
    {
      label,
      labelInfo,
      indicator,
      description,
      helperMessage,
      id: providedId,
      invalid,
      disabled,
      maxRows,
      showCharacterCount,
      ...textareaProps
    },
    ref,
  ) {
    const { inputId, descriptionId, helperMessageId, getDescribedBy } =
      useFieldIds(providedId)

    const [charCount, setCharCount] = useState(
      () =>
        String(textareaProps.value ?? textareaProps.defaultValue ?? '').length,
    )

    useEffect(() => {
      if (textareaProps.value !== undefined) {
        setCharCount(String(textareaProps.value).length)
      }
    }, [textareaProps.value])

    const {
      maxLength,
      onChange: onChangeProp,
      ...restTextareaProps
    } = textareaProps

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length)
      onChangeProp?.(e)
    }

    const internalRef = useRef<HTMLTextAreaElement | null>(null)
    const [maxPixelHeight, setMaxPixelHeight] = useState<number | undefined>(
      undefined,
    )

    // Auto-grow is always on. When maxRows is set, compute a pixel cap after
    // mount using the element's actual rendered line-height and padding
    // (density-aware). Until the cap is computed (or if maxRows is not set),
    // pass Infinity so the textarea grows without bound.
    const autoResizeHeight =
      maxRows !== undefined && maxPixelHeight !== undefined
        ? maxPixelHeight
        : Infinity
    const autoResizeRef = useAutoResize<HTMLTextAreaElement>(autoResizeHeight)

    useEffect(() => {
      if (!maxRows || !internalRef.current) return
      const el = internalRef.current

      const updateMaxHeight = () => {
        const style = window.getComputedStyle(el)
        const lineHeight = parseFloat(style.lineHeight)
        const paddingBlockStart = parseFloat(style.paddingBlockStart)
        const paddingBlockEnd = parseFloat(style.paddingBlockEnd)
        setMaxPixelHeight(
          lineHeight * maxRows + paddingBlockStart + paddingBlockEnd,
        )
      }

      const observer = new ResizeObserver(updateMaxHeight)
      observer.observe(el)
      updateMaxHeight()

      return () => observer.disconnect()
    }, [maxRows])

    const combinedRef = useMemo(
      () =>
        mergeRefs<HTMLTextAreaElement>(
          ref,
          autoResizeRef,
          internalRef as React.Ref<HTMLTextAreaElement>,
        ),
      [ref, autoResizeRef, internalRef],
    )

    const showHelperRow = helperMessage || showCharacterCount

    return (
      <Field className="eds-text-area" disabled={disabled}>
        {label && (
          <div className="label-row">
            <Field.Label htmlFor={inputId} indicator={indicator}>
              {label}
            </Field.Label>
            {labelInfo && (
              <Tooltip title={labelInfo} placement="top">
                <Button
                  variant="ghost"
                  icon
                  round
                  size="small"
                  tone="neutral"
                  aria-label="More information"
                >
                  <Icon data={info_circle} size="xs" />
                </Button>
              </Tooltip>
            )}
          </div>
        )}
        {description && (
          <Field.Description id={descriptionId}>
            {description}
          </Field.Description>
        )}
        {/* InputProps extends InputHTMLAttributes<HTMLInputElement>, so ref,
            onChange, and rest props are typed for HTMLInputElement. Casts are
            safe — the underlying element is always <textarea> when as="textarea". */}
        <Input
          ref={combinedRef as unknown as React.Ref<HTMLInputElement>}
          as="textarea"
          id={inputId}
          disabled={disabled}
          invalid={invalid}
          maxLength={maxLength}
          onChange={
            handleChange as unknown as React.ChangeEventHandler<HTMLInputElement>
          }
          aria-describedby={getDescribedBy({
            hasDescription: !!description,
            hasHelperMessage: !!helperMessage,
          })}
          {...(restTextareaProps as unknown as React.InputHTMLAttributes<HTMLInputElement>)}
        />
        {showHelperRow && (
          <div className="helper-row">
            {helperMessage && (
              <Field.HelperMessage
                id={helperMessageId}
                role={invalid ? 'alert' : undefined}
              >
                {helperMessage}
              </Field.HelperMessage>
            )}
            {showCharacterCount && (
              <span
                className="char-count"
                data-font-family="ui"
                data-font-size="xs"
                aria-live={
                  maxLength !== undefined && charCount >= maxLength * 0.8
                    ? 'polite'
                    : 'off'
                }
              >
                {maxLength !== undefined
                  ? `${charCount} / ${maxLength}`
                  : charCount}
              </span>
            )}
          </div>
        )}
      </Field>
    )
  },
)

TextArea.displayName = 'TextArea'
