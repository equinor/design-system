'use client'

import { useState } from 'react'
import { IconCard } from '@/components/IconCard'
import { IconFilterControls } from '@/components/IconFilterControls'
import { PropertyEditor } from '@/components/PropertyEditor'
import { generateIconYaml } from '@/lib/generateIconYaml'
import { PlatformLayout } from '@/components/PlatformLayout'
import { ComponentSidebar } from '@/components/ComponentSidebar'
import {
  iconPropertySchema,
  getDefaultPropertyValues,
  type IconProperties,
} from '@/lib/iconPropertySchema'
import { Accordion } from '@equinor/eds-core-react'
import type { IconData } from '@equinor/eds-icons'
import { save } from '@equinor/eds-icons'
import '../buttons/layout.css'

const categories = [
  {
    title: 'Inputs',
    items: [
      { label: 'Button', href: '/power-apps/buttons' },
      { label: 'Text Input' },
      { label: 'Checkbox' },
      { label: 'Radio' },
    ],
  },
  {
    title: 'Display',
    items: [
      { label: 'Icon', href: '/power-apps/icons', active: true },
      { label: 'Card' },
      { label: 'Label' },
    ],
  },
]

export default function PowerAppsIconsPage() {
  const [iconData, setIconData] = useState<IconData | null>(save)
  const [disabled, setDisabled] = useState(false)
  const [properties, setProperties] = useState<Omit<IconProperties, 'iconData'>>(
    getDefaultPropertyValues(),
  )

  const handlePropertyChange = (
    propertyId: string,
    value: string | number | boolean,
  ) => {
    setProperties((prev) => ({
      ...prev,
      [propertyId]: value,
    }))
  }

  if (!iconData) {
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
              <h1 className="configurator-title">Icon</h1>
              <p className="configurator-description">
                Please select an icon to get started.
              </p>
              <IconFilterControls
                iconData={iconData}
                disabled={disabled}
                onIconChange={setIconData}
                onDisabledChange={setDisabled}
              />
            </div>
          </main>
        </div>
      </PlatformLayout>
    )
  }

  const name = `EDSIcon_${iconData.name}${disabled ? '_disabled' : ''}`
  const yaml = generateIconYaml({
    name,
    iconData,
    color: properties.color as string,
    width: properties.width as number,
    height: properties.height as number,
    x: properties.x as number,
    y: properties.y as number,
    tooltip: properties.tooltip as string,
    onSelectAction: properties.onSelectAction as string,
    borderColor: properties.borderColor as string,
    borderThickness: properties.borderThickness as number,
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
            <h1 className="configurator-title">Icon</h1>
            <p className="configurator-description">
              Configure your icon by selecting from 715+ EDS icons and customizing
              properties. The preview and YAML code update in real-time.
            </p>

            <IconFilterControls
              iconData={iconData}
              disabled={disabled}
              onIconChange={setIconData}
              onDisabledChange={setDisabled}
            />

            <div className="button-preview-section">
              <h2 className="preview-title">Preview</h2>
              <IconCard
                name={name}
                iconData={iconData}
                color={properties.color as string}
                disabled={disabled}
                yamlContent={yaml}
              />
            </div>

            <div className="properties-section">
              <h2 className="properties-title">Customize Properties</h2>
              <p className="properties-description">
                Fine-tune icon properties. These map to EDS design tokens and
                are supported by Power Apps.
              </p>

              <Accordion className="properties-accordion">
                <Accordion.Item isExpanded>
                  <Accordion.Header>Content</Accordion.Header>
                  <Accordion.Panel>
                    <PropertyEditor
                      schema={iconPropertySchema}
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
                      schema={iconPropertySchema}
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
                      schema={iconPropertySchema}
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
                      schema={iconPropertySchema}
                      values={properties}
                      onChange={handlePropertyChange}
                      category="interaction"
                    />
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </div>
          </div>
        </main>
      </div>
    </PlatformLayout>
  )
}
