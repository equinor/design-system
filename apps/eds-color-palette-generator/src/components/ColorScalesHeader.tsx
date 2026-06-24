import React from 'react'
import { StepDefinition } from '@/config/types'
import { getGroupName } from '@/config/groups'

type ColorScalesHeaderProps = {
  steps: StepDefinition[]
}

export const ColorScalesHeader = ({ steps }: ColorScalesHeaderProps) => {
  // Group label spans are derived from runs of consecutive steps sharing a
  // groupId, so reassigning a step's group or inserting one updates the header
  // automatically.
  const generateGroupSpans = () => {
    const groups: Array<{ groupId: string; span: number; title: string }> = []

    steps.forEach((step) => {
      const last = groups[groups.length - 1]
      if (last && last.groupId === step.groupId) {
        last.span++
      } else {
        groups.push({
          groupId: step.groupId,
          span: 1,
          title: getGroupName(step.groupId),
        })
      }
    })

    return groups
  }

  const groupSpans = generateGroupSpans()

  return (
    <>
      <div
        className="grid gap-3 mb-2 text-center text-subtle"
        style={{
          gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`,
        }}
      >
        {groupSpans.map((group, index) => (
          <div
            key={`${group.groupId}-${index}`}
            className="border-b border-neutral-subtle pb-2"
            style={{
              gridColumn: `span ${group.span}`,
            }}
          >
            {group.title}
          </div>
        ))}
      </div>

      <div
        className="grid gap-3 mb-1 px-4"
        style={{
          gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`,
        }}
      >
        {steps.map((_, index) => (
          <div key={index} className="flex items-center justify-center">
            {index + 1}
          </div>
        ))}
      </div>
    </>
  )
}
