import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useId,
  useMemo,
  useState,
  type ReactElement,
} from 'react'
import type { ValidationMessageTone } from '../ValidationMessage/ValidationMessage.types'
import { FieldContext } from './Field.context'
import { FieldDescription } from './Field.Description'
import type { FieldProps } from './Field.types'
import { FieldLabel } from './Field.Label'
import { classNames, mergeSpaceSeparated } from './field.utils'

type EnhancedControlOptions = {
  controlId: string
  describedBy: string | undefined
  invalid: boolean
  required: boolean
  disabled: boolean
}

const enhanceControl = (
  element: ReactElement<Record<string, unknown>>,
  {
    controlId,
    describedBy,
    invalid,
    required,
    disabled,
  }: EnhancedControlOptions,
) => {
  const elementProps = element.props
  const mergedId = (elementProps.id as string | undefined) ?? controlId
  const describedByProp = elementProps['aria-describedby'] as string | undefined
  const ariaInvalidProp = elementProps['aria-invalid'] as boolean | undefined
  const ariaRequiredProp = elementProps['aria-required'] as boolean | undefined
  const disabledProp = elementProps.disabled as boolean | undefined
  const requiredProp = elementProps.required as boolean | undefined

  const ariaDescribedBy = mergeSpaceSeparated(describedByProp, describedBy)
  const ariaInvalid = ariaInvalidProp ?? (invalid ? true : undefined)
  const ariaRequired = ariaRequiredProp ?? (required ? true : undefined)
  const controlDisabled = disabledProp ?? (disabled ? true : undefined)
  const controlRequired = requiredProp ?? (required ? true : undefined)

  const nextProps = {
    id: mergedId,
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
    'aria-required': ariaRequired,
    disabled: controlDisabled,
    required: controlRequired,
  }

  if (!nextProps['aria-describedby']) {
    delete nextProps['aria-describedby']
  }

  if (!nextProps['aria-invalid']) {
    delete nextProps['aria-invalid']
  }

  if (!nextProps['aria-required']) {
    delete nextProps['aria-required']
  }

  if (!nextProps.disabled) {
    delete nextProps.disabled
  }

  if (!nextProps.required) {
    delete nextProps.required
  }

  return cloneElement(element, nextProps)
}

const FieldComponent = forwardRef<HTMLDivElement, FieldProps>(function Field(
  {
    id,
    controlId,
    required = false,
    disabled = false,
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const generatedId = useId()
  const resolvedControlId = controlId ?? `${generatedId}-control`
  const [descriptionIds, setDescriptionIds] = useState<string[]>([])
  const [validationEntries, setValidationEntries] = useState<
    Array<{ id: string; tone: ValidationMessageTone }>
  >([])

  const registerDescription = useCallback((descriptionId: string) => {
    setDescriptionIds((previous) => {
      if (previous.includes(descriptionId)) {
        return previous
      }

      return [...previous, descriptionId]
    })
  }, [])

  const unregisterDescription = useCallback((descriptionId: string) => {
    setDescriptionIds((previous) =>
      previous.filter((idValue) => idValue !== descriptionId),
    )
  }, [])

  const registerValidation = useCallback(
    (validationId: string, tone: ValidationMessageTone) => {
      setValidationEntries((previous) => {
        const filtered = previous.filter((entry) => entry.id !== validationId)
        const existing = previous.find((entry) => entry.id === validationId)

        if (existing && existing.tone === tone) {
          return previous
        }

        return [...filtered, { id: validationId, tone }]
      })
    },
    [],
  )

  const unregisterValidation = useCallback((validationId: string) => {
    setValidationEntries((previous) =>
      previous.filter((entry) => entry.id !== validationId),
    )
  }, [])

  const describedByIds = useMemo(
    () => [...descriptionIds, ...validationEntries.map((entry) => entry.id)],
    [descriptionIds, validationEntries],
  )

  const describedBy = useMemo(() => {
    if (describedByIds.length === 0) {
      return undefined
    }

    return describedByIds.join(' ')
  }, [describedByIds])

  const hasDangerValidation = useMemo(
    () => validationEntries.some((entry) => entry.tone === 'danger'),
    [validationEntries],
  )

  const contextValue = useMemo(
    () => ({
      controlId: resolvedControlId,
      disabled,
      required,
      registerDescription,
      unregisterDescription,
      registerValidation,
      unregisterValidation,
    }),
    [
      resolvedControlId,
      disabled,
      required,
      registerDescription,
      unregisterDescription,
      registerValidation,
      unregisterValidation,
    ],
  )

  let controlHandled = false

  const content = Children.map(children, (child) => {
    if (!isValidElement(child)) {
      return child
    }

    const element = child as ReactElement<Record<string, unknown>>

    if (element.type === FieldLabel || element.type === FieldDescription) {
      return child
    }

    if (!controlHandled) {
      controlHandled = true
      return (
        <div className="eds-field__control">
          {enhanceControl(element, {
            controlId: resolvedControlId,
            describedBy,
            invalid: hasDangerValidation,
            required,
            disabled,
          })}
        </div>
      )
    }

    return child
  })

  return (
    <FieldContext.Provider value={contextValue}>
      <div
        id={id}
        ref={ref}
        style={style}
        className={classNames('eds-field', className)}
        data-disabled={disabled ? 'true' : undefined}
        data-invalid={hasDangerValidation ? 'true' : undefined}
        data-vertical-gap="xs"
        data-horizontal-gap="sm"
        {...rest}
      >
        {content}
      </div>
    </FieldContext.Provider>
  )
})

FieldComponent.displayName = 'Field'

type CompoundField = typeof FieldComponent & {
  Label: typeof FieldLabel
  Description: typeof FieldDescription
}

export const Field = FieldComponent as CompoundField

Field.Label = FieldLabel
Field.Description = FieldDescription
