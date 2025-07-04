import { ColorDefinition } from '@/types'

type ColorManagementProps = {
  colors: ColorDefinition[]
  onUpdateColorName: (index: number, newName: string) => void
  onUpdateColorHue: (index: number, newHue: string) => void
  onRemoveColor: (index: number) => void
  onAddColor: (newColor: ColorDefinition) => void
}

export const ColorManagement = ({
  colors,
  onUpdateColorName,
  onUpdateColorHue,
  onRemoveColor,
  onAddColor,
}: ColorManagementProps) => {
  return (
    <fieldset className="p-6 space-y-4 border border-gray-200 rounded-lg dark:border-gray-800">
      <legend className="mb-2 font-medium">Color Management</legend>

      <div className="max-w-3xl mx-auto">
        {/* Header Row */}
        <div className="grid grid-cols-[1fr_1fr_auto] gap-4 mb-2 px-2 border-b border-gray-200 dark:border-gray-800 pb-2 font-medium">
          <div className="text-left">Name</div>
          <div className="text-left">Colour</div>
          <div className="text-right">Action</div>
        </div>

        {/* Color Rows */}
        <div className="space-y-2">
          {colors.map((color, index) => (
            <div
              key={`color-${index}`}
              className="grid grid-cols-[1fr_1fr_auto] gap-4 items-center p-2 border-b border-gray-200 dark:border-gray-800"
            >
              {/* Name Field */}
              <div>
                <input
                  type="text"
                  className="w-full p-2 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
                  value={color.name}
                  onChange={(e) => onUpdateColorName(index, e.target.value)}
                />
              </div>

              {/* Color Picker */}
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="w-8 h-8 cursor-pointer border border-gray-300 dark:border-gray-700 rounded"
                  value={color.hue}
                  onChange={(e) => onUpdateColorHue(index, e.target.value)}
                />
              </div>

              {/* Actions */}
              <div className="text-right">
                <button
                  className="px-3 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-700"
                  onClick={() => onRemoveColor(index)}
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
              const randomColor =
                '#' +
                Math.floor(Math.random() * 16777215)
                  .toString(16)
                  .padStart(6, '0')
              onAddColor({
                name: `color-${colors.length + 1}`,
                hue: randomColor,
              })
            }}
          >
            Add New Color
          </button>
        </div>
      </div>
    </fieldset>
  )
}
