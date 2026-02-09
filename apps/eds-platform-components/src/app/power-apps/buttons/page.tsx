'use client'

import { useState } from 'react'
import { ComponentCard } from '@/components/ComponentCard'
import { ButtonFilterControls } from '@/components/ButtonFilterControls'
import { generateButtonYaml } from '@/lib/generateButtonYaml'
import { PlatformLayout } from '@/components/PlatformLayout'
import { ComponentSidebar } from '@/components/ComponentSidebar'
import './layout.css'

type ButtonVariant = 'contained' | 'outlined' | 'ghost'
type ButtonColor = 'primary' | 'secondary' | 'danger'

const categories = [
  {
    title: 'Inputs',
    items: [
      { label: 'Button', active: true },
      { label: 'Text Input' },
      { label: 'Checkbox' },
      { label: 'Radio' },
    ],
  },
  {
    title: 'Display',
    items: [{ label: 'Card' }, { label: 'Label' }, { label: 'Icon' }],
  },
]

export default function PowerAppsButtonsPage() {
  const [variant, setVariant] = useState<ButtonVariant>('contained')
  const [color, setColor] = useState<ButtonColor>('primary')
  const [disabled, setDisabled] = useState(false)

  const name = `EDSButton_${variant}_${color}${disabled ? '_disabled' : ''}`
  const text = `${color.charAt(0).toUpperCase() + color.slice(1)} ${variant.charAt(0).toUpperCase() + variant.slice(1)} Button`
  const yaml = generateButtonYaml({
    name,
    variant,
    color,
    text,
    disabled,
  })

  return (
    <PlatformLayout activePlatform="power-platform">
      <div className="page-layout">
        <ComponentSidebar
          categories={categories}
          onRequestComponent={() => {
            window.open(
              'https://github.com/equinor/design-system/issues/new',
              '_blank',
            )
          }}
        />

        <main className="page-main">
          <div className="button-configurator">
            <h1 className="configurator-title">Button</h1>
            <p className="configurator-description">
              Configure your button by selecting options below. The preview and
              YAML code will update automatically.
            </p>

            <ButtonFilterControls
              variant={variant}
              color={color}
              disabled={disabled}
              onVariantChange={setVariant}
              onColorChange={setColor}
              onDisabledChange={setDisabled}
            />

            <div className="button-result">
              <ComponentCard
                name={name}
                variant={variant}
                color={color}
                disabled={disabled}
                yamlContent={yaml}
              />
            </div>
          </div>
        </main>
      </div>
    </PlatformLayout>
  )
}
