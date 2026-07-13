'use client'

import { useMemo } from 'react'
import { STEP_ROLES } from '@/utils/palette'

type StepSelectProps = {
  label: string
  value: number
  onChange: (v: number) => void
  /** Step indices to show as "Recommended" at the top */
  recommended?: number[]
  /** When set, only show steps matching this category prefix (e.g. 'bg/', 'fg/', 'text/') */
  only?: string[]
}

export function StepSelect({
  label,
  value,
  onChange,
  recommended,
  only,
}: StepSelectProps) {
  const allSteps = useMemo(() => {
    if (!only || only.length === 0) return STEP_ROLES.map((_, i) => i)
    return STEP_ROLES
      .map((role, i) => ({ role, i }))
      .filter(({ role }) => only.some((prefix) => role.includes(`· ${prefix}`)))
      .map(({ i }) => i)
  }, [only])

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
    <label className="flex items-center gap-1.5 text-xs text-strong">
      <span className="font-medium whitespace-nowrap">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="rounded border border-neutral-subtle bg-default text-xs px-2 py-1"
      >
        {hasGroups ? (
          <>
            <optgroup label="Recommended">
              {recSteps.map((i) => (
                <option key={i} value={i}>
                  {STEP_ROLES[i]}
                </option>
              ))}
            </optgroup>
            <optgroup label="Other">
              {otherSteps.map((i) => (
                <option key={i} value={i}>
                  {STEP_ROLES[i]}
                </option>
              ))}
            </optgroup>
          </>
        ) : (
          allSteps.map((i) => (
            <option key={i} value={i}>
              {STEP_ROLES[i]}
            </option>
          ))
        )}
      </select>
    </label>
  )
}
