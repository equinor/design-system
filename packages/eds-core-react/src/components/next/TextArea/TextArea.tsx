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
      invalid = false,
      disabled = false,
      maxRows,
      ...textareaProps
    },
    ref,
  ) {
    const { inputId, descriptionId, helperMessageId, getDescribedBy } =
      useFieldIds(providedId)

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
      const style = window.getComputedStyle(el)
      const lineHeight = parseFloat(style.lineHeight)
      const paddingBlockStart = parseFloat(style.paddingBlockStart)
      const paddingBlockEnd = parseFloat(style.paddingBlockEnd)
      setMaxPixelHeight(
        lineHeight * maxRows + paddingBlockStart + paddingBlockEnd,
      )
    }, [maxRows])

    const combinedRef = useMemo(
      () =>
        mergeRefs<HTMLTextAreaElement>(
          ref,
          autoResizeRef,
          internalRef as React.Ref<HTMLTextAreaElement>,
        ),
      [ref, autoResizeRef],
    )

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
        <Input
          ref={combinedRef as unknown as React.Ref<HTMLInputElement>}
          as="textarea"
          id={inputId}
          disabled={disabled}
          invalid={invalid}
          aria-describedby={getDescribedBy({
            hasDescription: !!description,
            hasHelperMessage: !!helperMessage,
          })}
          {...(textareaProps as unknown as React.InputHTMLAttributes<HTMLInputElement>)}
        />
        {helperMessage && (
          <Field.HelperMessage
            id={helperMessageId}
            role={invalid ? 'alert' : undefined}
          >
            {helperMessage}
          </Field.HelperMessage>
        )}
      </Field>
    )
  },
)

TextArea.displayName = 'TextArea'
