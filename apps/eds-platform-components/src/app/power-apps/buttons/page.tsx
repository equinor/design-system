'use client'

import { ComponentCard } from '@/components/ComponentCard'
import { generateButtonYaml } from '@/lib/generateButtonYaml'
import { PlatformLayout } from '@/components/PlatformLayout'
import { ComponentSidebar } from '@/components/ComponentSidebar'
import { Accordion } from '@equinor/eds-core-react'
import './layout.css'

type ButtonVariant = 'contained' | 'outlined' | 'ghost'
type ButtonColor = 'primary' | 'secondary' | 'danger'

type ButtonConfig = {
  variant: ButtonVariant
  color: ButtonColor
  disabled?: boolean
}

const buttonConfigs: ButtonConfig[] = [
  // Contained variants
  { variant: 'contained', color: 'primary' },
  { variant: 'contained', color: 'secondary' },
  { variant: 'contained', color: 'danger' },
  { variant: 'contained', color: 'primary', disabled: true },

  // Outlined variants
  { variant: 'outlined', color: 'primary' },
  { variant: 'outlined', color: 'secondary' },
  { variant: 'outlined', color: 'danger' },
  { variant: 'outlined', color: 'primary', disabled: true },

  // Ghost variants
  { variant: 'ghost', color: 'primary' },
  { variant: 'ghost', color: 'secondary' },
  { variant: 'ghost', color: 'danger' },
  { variant: 'ghost', color: 'primary', disabled: true },
]

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
          <Accordion className="variant-accordion">
            <Accordion.Item isExpanded>
              <Accordion.Header>Contained - Primary</Accordion.Header>
              <Accordion.Panel>
                <div className="button-cards-row">
                  {buttonConfigs
                    .filter(
                      (config) =>
                        config.variant === 'contained' &&
                        config.color === 'primary',
                    )
                    .map((config, index) => {
                      const name = `EDSButton_contained_${config.color}${config.disabled ? '_disabled' : ''}`
                      const text = `${config.color.charAt(0).toUpperCase() + config.color.slice(1)} Contained Button`
                      const yaml = generateButtonYaml({
                        name,
                        variant: config.variant,
                        color: config.color,
                        text,
                        disabled: config.disabled,
                      })

                      return (
                        <ComponentCard
                          key={`${config.variant}-${config.color}-${index}`}
                          name={name}
                          variant={config.variant}
                          color={config.color}
                          disabled={config.disabled}
                          yamlContent={yaml}
                        />
                      )
                    })}
                </div>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item isExpanded>
              <Accordion.Header>Contained - Secondary</Accordion.Header>
              <Accordion.Panel>
                <div className="button-cards-row">
                  {buttonConfigs
                    .filter(
                      (config) =>
                        config.variant === 'contained' &&
                        config.color === 'secondary',
                    )
                    .map((config, index) => {
                      const name = `EDSButton_contained_${config.color}${config.disabled ? '_disabled' : ''}`
                      const text = `${config.color.charAt(0).toUpperCase() + config.color.slice(1)} Contained Button`
                      const yaml = generateButtonYaml({
                        name,
                        variant: config.variant,
                        color: config.color,
                        text,
                        disabled: config.disabled,
                      })

                      return (
                        <ComponentCard
                          key={`${config.variant}-${config.color}-${index}`}
                          name={name}
                          variant={config.variant}
                          color={config.color}
                          disabled={config.disabled}
                          yamlContent={yaml}
                        />
                      )
                    })}
                </div>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item isExpanded>
              <Accordion.Header>Contained - Danger</Accordion.Header>
              <Accordion.Panel>
                <div className="button-cards-row">
                  {buttonConfigs
                    .filter(
                      (config) =>
                        config.variant === 'contained' &&
                        config.color === 'danger',
                    )
                    .map((config, index) => {
                      const name = `EDSButton_contained_${config.color}${config.disabled ? '_disabled' : ''}`
                      const text = `${config.color.charAt(0).toUpperCase() + config.color.slice(1)} Contained Button`
                      const yaml = generateButtonYaml({
                        name,
                        variant: config.variant,
                        color: config.color,
                        text,
                        disabled: config.disabled,
                      })

                      return (
                        <ComponentCard
                          key={`${config.variant}-${config.color}-${index}`}
                          name={name}
                          variant={config.variant}
                          color={config.color}
                          disabled={config.disabled}
                          yamlContent={yaml}
                        />
                      )
                    })}
                </div>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item>
              <Accordion.Header>Outlined Buttons</Accordion.Header>
              <Accordion.Panel>
                <div className="button-cards-grid">
                  {buttonConfigs
                    .filter((config) => config.variant === 'outlined')
                    .map((config, index) => {
                      const name = `EDSButton_outlined_${config.color}${config.disabled ? '_disabled' : ''}`
                      const text = `${config.color.charAt(0).toUpperCase() + config.color.slice(1)} Outlined Button`
                      const yaml = generateButtonYaml({
                        name,
                        variant: config.variant,
                        color: config.color,
                        text,
                        disabled: config.disabled,
                      })

                      return (
                        <ComponentCard
                          key={`${config.variant}-${config.color}-${index}`}
                          name={name}
                          variant={config.variant}
                          color={config.color}
                          disabled={config.disabled}
                          yamlContent={yaml}
                        />
                      )
                    })}
                </div>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item>
              <Accordion.Header>Ghost Buttons</Accordion.Header>
              <Accordion.Panel>
                <div className="button-cards-grid">
                  {buttonConfigs
                    .filter((config) => config.variant === 'ghost')
                    .map((config, index) => {
                      const name = `EDSButton_ghost_${config.color}${config.disabled ? '_disabled' : ''}`
                      const text = `${config.color.charAt(0).toUpperCase() + config.color.slice(1)} Ghost Button`
                      const yaml = generateButtonYaml({
                        name,
                        variant: config.variant,
                        color: config.color,
                        text,
                        disabled: config.disabled,
                      })

                      return (
                        <ComponentCard
                          key={`${config.variant}-${config.color}-${index}`}
                          name={name}
                          variant={config.variant}
                          color={config.color}
                          disabled={config.disabled}
                          yamlContent={yaml}
                        />
                      )
                    })}
                </div>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </main>
      </div>
    </PlatformLayout>
  )
}
