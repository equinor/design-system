'use client'

import { useMemo } from 'react'
import {
  PALETTE_STEPS,
  stepLabel,
  stepRolesText,
  stepsWithRole,
} from '@/config/config'

type StepSelectProps = {
  label: string
  /** 0-based step index */
  value: number
  onChange: (v: number) => void
  /** Step indices to show as "Recommended" at the top */
  recommended?: number[]
  /**
   * When set, only offer steps that a Tokens Studio role of this group uses,
   * e.g. `text` for every step a `text.*` or `icon.*` token points at.
   */
  only?: 'background' | 'border' | 'text'
}

const ALL_STEP_INDICES = PALETTE_STEPS.map((_, i) => i)

const SELECT_CLASS =
  'rounded border border-input bg-input px-2 py-1 text-sm text-primary hover:border-input-hover'

function StepOption({ index }: { index: number }) {
  return (
    <option value={index} title={stepRolesText(index + 1)}>
      {stepLabel(index + 1)}
    </option>
  )
}

export function StepSelect({
  label,
  value,
  onChange,
  recommended,
  only,
}: StepSelectProps) {
  const allSteps = useMemo(
    () =>
      only
        ? stepsWithRole(only).map((step) => step.step - 1)
        : ALL_STEP_INDICES,
    [only],
  )

  const { recSteps, otherSteps } = useMemo(() => {
    if (!recommended || recommended.length === 0) {
      return { recSteps: [], otherSteps: allSteps }
    }
    const recSet = new Set(recommended)
    return {
      recSteps: recommended.filter((i) => allSteps.includes(i)),
      otherSteps: allSteps.filter((i) => !recSet.has(i)),
    }
  }, [recommended, allSteps])

  const hasGroups = recSteps.length > 0

  return (
    <label className="flex items-center gap-1.5 text-sm text-primary">
      <span className="font-medium whitespace-nowrap">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={SELECT_CLASS}
      >
        {hasGroups ? (
          <>
            <optgroup label="Recommended">
              {recSteps.map((i) => (
                <StepOption key={i} index={i} />
              ))}
            </optgroup>
            <optgroup label="Other">
              {otherSteps.map((i) => (
                <StepOption key={i} index={i} />
              ))}
            </optgroup>
          </>
        ) : (
          allSteps.map((i) => <StepOption key={i} index={i} />)
        )}
      </select>
    </label>
  )
}
