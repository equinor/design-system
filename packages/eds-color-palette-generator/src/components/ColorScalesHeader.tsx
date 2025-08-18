import React from 'react'
import { PALETTE_STEPS } from '@/config/config'

export const ColorScalesHeader = () => {
  // Generate category groups based on consecutive steps with the same category
  const generateCategoryGroups = () => {
    const groups: Array<{ category: string; span: number; title: string }> = []
    let currentCategory = ''
    let currentSpan = 0

    PALETTE_STEPS.forEach((step) => {
      if (step.category !== currentCategory) {
        // If we have a previous group, add it to the groups array
        if (currentSpan > 0) {
          groups.push({
            category: currentCategory,
            span: currentSpan,
            title: capitalizeCategory(currentCategory),
          })
        }
        // Start a new group
        currentCategory = step.category
        currentSpan = 1
      } else {
        // Continue the current group
        currentSpan++
      }
    })

    // Add the last group
    if (currentSpan > 0) {
      groups.push({
        category: currentCategory,
        span: currentSpan,
        title: capitalizeCategory(currentCategory),
      })
    }

    return groups
  }

  const capitalizeCategory = (category: string): string => {
    return category
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const categoryGroups = generateCategoryGroups()

  return (
    <>
      <div
        className="grid gap-3 mb-2 text-center"
        style={{
          gridTemplateColumns: `repeat(${PALETTE_STEPS.length}, minmax(0, 1fr))`,
        }}
      >
        {categoryGroups.map((group, index) => (
          <div
            key={index}
            className="border-b border-gray-300 dark:border-gray-800"
            style={{
              gridColumn: `span ${group.span}`,
            }}
          >
            {group.title}
          </div>
        ))}
      </div>

      <div
        className="grid gap-3 mb-4"
        style={{
          gridTemplateColumns: `repeat(${PALETTE_STEPS.length}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: PALETTE_STEPS.length }).map((_, index) => (
          <div key={index} className="flex items-center justify-center">
            {index + 1}
          </div>
        ))}
      </div>
    </>
  )
}
