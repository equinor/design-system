import React from 'react'
import { stepGroups } from '@/config/config'

export const ColorScalesHeader = () => {
  const getColSpanClass = (span: number) => {
    switch (span) {
      case 1:
        return 'col-span-1'
      case 2:
        return 'col-span-2'
      case 3:
        return 'col-span-3'
      case 4:
        return 'col-span-4'
      case 5:
        return 'col-span-5'
      default:
        return 'col-span-1'
    }
  }

  return (
    <>
      <div className="grid gap-3 mb-2 grid-cols-15 text-center">
        {stepGroups.map((group, index) => (
          <div
            key={index}
            className={`${getColSpanClass(group.span)} border-b border-gray-300 dark:border-gray-800`}
          >
            {group.title}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-15 gap-3 mb-4">
        {Array.from({ length: 15 }).map((_, index) => (
          <div key={index} className="flex items-center justify-center">
            {index + 1}
          </div>
        ))}
      </div>
    </>
  )
}
