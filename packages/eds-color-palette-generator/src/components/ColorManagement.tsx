import { ColorDefinition } from '@/types'
import { isValidColorFormat, parseColorToHex } from '@/utils/color'
import { useState, useEffect } from 'react'

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
  // Track local color input values and validation state for each color
  const [colorInputs, setColorInputs] = useState<
    Record<number, { value: string; isValid: boolean }>
  >(
    colors.reduce(
      (acc, color, index) => ({
        ...acc,
        [index]: { value: color.hex, isValid: true },
      }),
      {},
    ),
  )

  const handleColorInputChange = (index: number, value: string) => {
    const isValid = isValidColorFormat(value)
    setColorInputs((prev) => ({
      ...prev,
      [index]: { value, isValid },
    }))

    // Only update parent if valid
    if (isValid) {
      const hexValue = parseColorToHex(value)
      if (hexValue) {
        onUpdateColorHex(index, hexValue)
      }
    }
  }

  // Sync local state when colors prop changes (e.g., new color added)
  useEffect(() => {
    setColorInputs(
      colors.reduce(
        (acc, color, index) => ({
          ...acc,
          [index]: { value: color.hex, isValid: true },
        }),
        {},
      ),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors.length])

  return (
    <fieldset className="p-6 space-y-4 border border-neutral-subtle rounded-lg">
      <legend className="mb-2 font-medium">Colours</legend>

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
              className="grid grid-cols-[1fr_1fr_auto] gap-4 items-start p-2 border-b border-neutral-subtle"
            >
              {/* Name Field */}
              <div>
                <input
                  type="text"
                  className="w-full p-2 text-sm bg-input border border-neutral-subtle rounded"
                  value={color.name}
                  onChange={(e) => onUpdateColorName(index, e.target.value)}
                  data-testid={`color-name-input-${index}`}
                  aria-label={`Color ${index + 1} name`}
                />
              </div>

              {/* Color Input */}
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  className={`w-full p-2 text-sm bg-input rounded ${
                    colorInputs[index]?.isValid === false
                      ? 'border-2 border-danger-fill-emphasis-default'
                      : 'border border-neutral-subtle'
                  }`}
                  value={colorInputs[index]?.value || color.hex}
                  onChange={(e) =>
                    handleColorInputChange(index, e.target.value)
                  }
                  onBlur={() => {
                    // Reset to valid hex on blur if invalid
                    if (colorInputs[index]?.isValid === false) {
                      setColorInputs((prev) => ({
                        ...prev,
                        [index]: { value: color.hex, isValid: true },
                      }))
                    }
                  }}
                  placeholder="HEX or OKLCH format"
                  data-testid={`color-hex-input-${index}`}
                  aria-label={`Color ${index + 1} value`}
                  aria-invalid={colorInputs[index]?.isValid === false}
                />
                {colorInputs[index]?.isValid === false && (
                  <span
                    className="text-xs text-danger-subtle"
                    data-testid={`color-format-error-${index}`}
                  >
                    Colour format is not valid
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="text-right">
                <button
                  type="button"
                  className="px-3 py-1 text-xs bg-danger-fill-muted-default hover:bg-danger-fill-muted-hover rounded"
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

        <div className="mt-4 text-left">
          <button
            type="button"
            className="px-4 py-2 text-sm bg-neutral-fill-emphasis-default hover:bg-accent-fill-emphasis-hover rounded text-strong-on-emphasis"
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
            Add
          </button>
        </div>
      </div>
    </fieldset>
  )
}
