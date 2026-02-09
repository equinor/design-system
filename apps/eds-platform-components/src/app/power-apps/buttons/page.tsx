'use client'

import { useState } from 'react'
import { ComponentCard } from '@/components/ComponentCard'
import { ButtonFilterControls } from '@/components/ButtonFilterControls'
import { PropertyEditor } from '@/components/PropertyEditor'
import { generateButtonYaml } from '@/lib/generateButtonYaml'
import { PlatformLayout } from '@/components/PlatformLayout'
import { ComponentSidebar } from '@/components/ComponentSidebar'
import {
  buttonPropertySchema,
  getDefaultPropertyValues,
  type ButtonProperties,
} from '@/lib/buttonPropertySchema'
import { Accordion } from '@equinor/eds-core-react'
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
  const [properties, setProperties] =
    useState<Partial<ButtonProperties>>(getDefaultPropertyValues())

  const handlePropertyChange = (
    propertyId: string,
    value: string | number | boolean,
  ) => {
    setProperties((prev) => ({
      ...prev,
      [propertyId]: value,
    }))
  }

  const name = `EDSButton_${variant}_${color}${disabled ? '_disabled' : ''}`
  const yaml = generateButtonYaml({
    name,
    variant,
    color,
    text: properties.text || 'Button',
    disabled,
    width: properties.width,
    height: properties.height,
    x: properties.x,
    y: properties.y,
    paddingLeft: properties.paddingLeft,
    paddingRight: properties.paddingRight,
    paddingTop: properties.paddingTop,
    paddingBottom: properties.paddingBottom,
    borderRadius: properties.borderRadius,
    borderThickness: properties.borderThickness,
    fontSize: properties.fontSize,
    tooltip: properties.tooltip,
    onSelectAction: properties.onSelectAction,
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
              Configure your button by selecting variant, color, and customizing
              properties. The preview and YAML code update in real-time.
            </p>

            <ButtonFilterControls
              variant={variant}
              color={color}
              disabled={disabled}
              onVariantChange={setVariant}
              onColorChange={setColor}
              onDisabledChange={setDisabled}
            />

            <div className="properties-section">
              <h2 className="properties-title">Customize Properties</h2>
              <p className="properties-description">
                Fine-tune button properties. These map to EDS design tokens and
                are supported by Power Apps.
              </p>

              <Accordion className="properties-accordion">
                <Accordion.Item isExpanded>
                  <Accordion.Header>Content</Accordion.Header>
                  <Accordion.Panel>
                    <PropertyEditor
                      schema={buttonPropertySchema}
                      values={properties}
                      onChange={handlePropertyChange}
                      category="content"
                    />
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item>
                  <Accordion.Header>Layout & Size</Accordion.Header>
                  <Accordion.Panel>
                    <PropertyEditor
                      schema={buttonPropertySchema}
                      values={properties}
                      onChange={handlePropertyChange}
                      category="layout"
                    />
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item>
                  <Accordion.Header>Style</Accordion.Header>
                  <Accordion.Panel>
                    <PropertyEditor
                      schema={buttonPropertySchema}
                      values={properties}
                      onChange={handlePropertyChange}
                      category="style"
                    />
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item>
                  <Accordion.Header>Interaction</Accordion.Header>
                  <Accordion.Panel>
                    <PropertyEditor
                      schema={buttonPropertySchema}
                      values={properties}
                      onChange={handlePropertyChange}
                      category="interaction"
                    />
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </div>

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
