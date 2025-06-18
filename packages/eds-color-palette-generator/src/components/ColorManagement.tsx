import React from 'react'
import { ColorDefinition } from '@/types'

type ColorManagementProps = {
  colors: ColorDefinition[]
  setColors: React.Dispatch<React.SetStateAction<ColorDefinition[]>>
}

export const ColorManagement = ({
  colors,
  setColors,
}: ColorManagementProps) => {
  // Function to add a new color
  const addColor = (newColor: ColorDefinition) => {
    setColors([...colors, newColor])
  }

  // Function to remove a color
  const removeColor = (colorName: string) => {
    setColors(colors.filter((color) => color.name !== colorName))
  }

  // Function to update a color's hue
  const updateColorHue = (colorName: string, newHue: string) => {
    setColors(
      colors.map((color) =>
        color.name === colorName ? { ...color, hue: newHue } : color,
      ),
    )
  }

  return (
    <div className="max-w-3xl p-6 mx-auto mb-12 border border-gray-200 rounded-lg dark:border-gray-800">
      {/* Header Row */}
      <div className="grid grid-cols-[1fr_1fr_auto] gap-4 mb-2 px-2 border-b border-gray-200 dark:border-gray-800 pb-2 font-medium">
        <div className="text-left">Name</div>
        <div className="text-left">Colour</div>
        <div className="text-right">Action</div>
      </div>

      {/* Color Rows */}
      <div className="space-y-2">
        {colors.map((color) => (
          <div
            key={color.name}
            className="grid grid-cols-[1fr_1fr_auto] gap-4 items-center p-2 border-b border-gray-200 dark:border-gray-800"
          >
            {/* Name Field */}
            <div>
              <input
                type="text"
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
                value={color.name}
                onChange={(e) => {
                  const updatedColors = colors.map((c) =>
                    c === color ? { ...c, name: e.target.value } : c,
                  )
                  setColors(updatedColors)
                }}
              />
            </div>

            {/* Color Picker */}
            <div className="flex items-center gap-2">
              <input
                type="color"
                className="w-8 h-8 cursor-pointer border border-gray-300 dark:border-gray-700 rounded"
                value={color.hue}
                onChange={(e) => updateColorHue(color.name, e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="text-right">
              <button
                className="px-3 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-700"
                onClick={() => removeColor(color.name)}
                disabled={colors.length <= 1}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Color Button */}
      <div className="text-left mt-4">
        <button
          className="px-4 py-2 text-sm text-white bg-[#007079] rounded"
          onClick={() => {
            // Generate a random color in hex format
            const randomColor =
              '#' +
              Math.floor(Math.random() * 16777215)
                .toString(16)
                .padStart(6, '0')
            addColor({
              name: `Color ${colors.length + 1}`,
              hue: randomColor,
            })
          }}
        >
          Add New Color
        </button>
      </div>
    </div>
  )
}
