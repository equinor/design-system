import { ColorDefinition } from '@/types'

type ColorManagementProps = {
  colors: ColorDefinition[]
  onUpdateColorName: (index: number, newName: string) => void
  onUpdateColorHex: (index: number, newHex: string) => void
  onRemoveColor: (index: number) => void
  onAddColor: (newColor: ColorDefinition) => void
}

export const ColorManagement = ({
  colors,
  onUpdateColorName,
  onUpdateColorHex,
  onRemoveColor,
  onAddColor,
}: ColorManagementProps) => {
  return (
    <fieldset className="p-6 space-y-4 border border-neutral-subtle rounded-lg">
      <legend className="mb-2 font-medium">Colour configuration</legend>

      <div className="max-w-3xl mx-auto">
        {/* Header Row */}
        <div className="grid grid-cols-[1fr_1fr_auto] gap-4 mb-2 px-2 border-b border-neutral-subtle pb-2 font-medium">
          <div className="text-left">Name</div>
          <div className="text-left">Colour</div>
          <div className="text-right">Action</div>
        </div>

        {/* Color Rows */}
        <div className="space-y-2">
          {colors.map((color, index) => (
            <div
              key={`color-${index}`}
              className="grid grid-cols-[1fr_1fr_auto] gap-4 items-center p-2 border-b border-neutral-subtle"
            >
              {/* Name Field */}
              <div>
                <input
                  type="text"
                  className="w-full p-2 text-sm bg-neutral-default border border-neutral-medium rounded"
                  value={color.name}
                  onChange={(e) => onUpdateColorName(index, e.target.value)}
                  data-testid={`color-name-input-${index}`}
                />
              </div>

              {/* Color Picker */}
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="w-8 h-8 border border-neutral-medium rounded cursor-pointer"
                  value={color.hex}
                  onChange={(e) => onUpdateColorHex(index, e.target.value)}
                  data-testid={`color-hex-input-${index}`}
                />
              </div>

              {/* Actions */}
              <div className="text-right">
                <button
                  className="px-3 py-1 text-xs bg-danger-strong hover:bg-danger-strong-hover text-danger-inverted rounded"
                  onClick={() => onRemoveColor(index)}
                  disabled={colors.length <= 1}
                  data-testid={`remove-color-button-${index}`}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Color Button */}
        <div className="mt-4 text-left">
          <button
            className="px-4 py-2 text-sm bg-primary-strong hover:bg-primary-strong-hover text-primary-inverted rounded"
            onClick={() => {
              const randomColor =
                '#' +
                Math.floor(Math.random() * 16777215)
                  .toString(16)
                  .padStart(6, '0')
              onAddColor({
                name: `color-${colors.length + 1}`,
                hex: randomColor,
              })
            }}
            data-testid="add-color-button"
          >
            Add New Color
          </button>
        </div>
      </div>
    </fieldset>
  )
}
