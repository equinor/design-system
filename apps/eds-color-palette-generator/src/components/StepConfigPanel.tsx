'use client'

import React from 'react'
import { Plus, Trash } from 'lucide-react'
import { StepDefinition } from '@/config/types'
import { PALETTE_GROUPS } from '@/config/groups'
import { NewStepInput } from '@/utils/stepConfig'

type StepConfigPanelProps = {
  steps: StepDefinition[]
  colorScheme: 'light' | 'dark'
  onInsertStep: (index: number, input?: NewStepInput) => void
  onRemoveStep: (index: number) => void
  onRenameStep: (index: number, name: string) => void
  onChangeStepGroup: (index: number, groupId: string) => void
  onChangeStepLightness: (
    index: number,
    mode: 'light' | 'dark',
    value: number,
  ) => void
}

/**
 * Insert-step affordance rendered between rows. Inserting at `index` puts the
 * new step at that position in the ordered scale (0 = before the first step,
 * steps.length = after the last).
 */
function InsertRow({
  index,
  onInsert,
}: {
  index: number
  onInsert: (index: number) => void
}) {
  return (
    <div className="flex justify-center -my-1">
      <button
        type="button"
        onClick={() => onInsert(index)}
        className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-md text-subtle hover:bg-neutral-fill-muted-hover hover:text-strong print-hide"
        title={`Insert a step at position ${index + 1}`}
        aria-label={`Insert a step at position ${index + 1}`}
      >
        <Plus className="w-3 h-3" />
        Insert step
      </button>
    </div>
  )
}

export const StepConfigPanel = ({
  steps,
  colorScheme,
  onInsertStep,
  onRemoveStep,
  onRenameStep,
  onChangeStepGroup,
  onChangeStepLightness,
}: StepConfigPanelProps) => {
  return (
    <fieldset className="p-4">
      <legend className="mb-1 font-medium">Step configuration</legend>
      <p className="mb-4 text-sm text-subtle">
        Add steps between existing ones, reassign them to a group, and tune their
        lightness. The scale and contrast checks update automatically.
      </p>

      <div className="space-y-1">
        <InsertRow index={0} onInsert={onInsertStep} />

        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-wrap items-end gap-3 rounded-md bg-canvas p-3">
              <span
                className="w-6 text-center text-sm font-mono text-subtle"
                aria-hidden
              >
                {index + 1}
              </span>

              <label className="flex flex-col gap-1 flex-1 min-w-40">
                <span className="text-xs text-subtle">Name</span>
                <input
                  type="text"
                  value={step.name}
                  onChange={(e) => onRenameStep(index, e.target.value)}
                  className="px-3 py-1.5 text-sm rounded-md border border-neutral-subtle hover:border-neutral-medium focus:border-neutral-strong bg-input"
                  aria-label={`Name for step ${index + 1}`}
                />
              </label>

              <label className="flex flex-col gap-1 min-w-44">
                <span className="text-xs text-subtle">Group</span>
                <select
                  value={step.groupId}
                  onChange={(e) => onChangeStepGroup(index, e.target.value)}
                  className="px-2 py-1.5 text-sm rounded-md border border-neutral-subtle hover:border-neutral-medium focus:border-neutral-strong bg-input"
                  aria-label={`Group for step ${index + 1}`}
                >
                  {PALETTE_GROUPS.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                  {/* Preserve an unknown group id rather than silently dropping it */}
                  {!PALETTE_GROUPS.some((g) => g.id === step.groupId) && (
                    <option value={step.groupId}>{step.groupId}</option>
                  )}
                </select>
              </label>

              <label className="flex flex-col gap-1 w-24">
                <span className="text-xs text-subtle">
                  Light L
                  {colorScheme === 'light' ? ' •' : ''}
                </span>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={step.lightValue}
                  onChange={(e) =>
                    onChangeStepLightness(index, 'light', Number(e.target.value))
                  }
                  className="w-full px-2 py-1.5 text-sm text-center bg-input border border-neutral-subtle rounded-md"
                  aria-label={`Light mode lightness for step ${index + 1}`}
                  inputMode="decimal"
                />
              </label>

              <label className="flex flex-col gap-1 w-24">
                <span className="text-xs text-subtle">
                  Dark L
                  {colorScheme === 'dark' ? ' •' : ''}
                </span>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={step.darkValue}
                  onChange={(e) =>
                    onChangeStepLightness(index, 'dark', Number(e.target.value))
                  }
                  className="w-full px-2 py-1.5 text-sm text-center bg-input border border-neutral-subtle rounded-md"
                  aria-label={`Dark mode lightness for step ${index + 1}`}
                  inputMode="decimal"
                />
              </label>

              <button
                type="button"
                onClick={() => onRemoveStep(index)}
                disabled={steps.length <= 1}
                className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-neutral-fill-muted-hover disabled:opacity-40 disabled:cursor-not-allowed print-hide"
                title="Remove step"
                aria-label={`Remove step ${index + 1}`}
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>

            <InsertRow index={index + 1} onInsert={onInsertStep} />
          </React.Fragment>
        ))}
      </div>
    </fieldset>
  )
}
