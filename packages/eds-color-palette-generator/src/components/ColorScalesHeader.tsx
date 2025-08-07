import React from 'react'

export const ColorScalesHeader = () => {
  return (
    <>
      <div className="grid gap-3 mb-2 grid-cols-15 text-center">
        <div className="col-span-2 border-b border-gray-300 dark:border-gray-800">
          background
        </div>
        <div className="col-span-3 pb-2 border-b border-gray-300 dark:border-gray-800">
          background-fill-subtle
        </div>
        <div className="col-span-3 border-b border-gray-300 dark:border-gray-800">
          border
        </div>
        <div className="col-span-4 border-b border-gray-300 dark:border-gray-800">
          text
        </div>
        <div className="col-span-3 border-b border-gray-300 dark:border-gray-800">
          background-fill-strong
        </div>
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
