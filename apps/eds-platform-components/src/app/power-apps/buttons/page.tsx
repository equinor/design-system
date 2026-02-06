import { ComponentCard } from '@/components/ComponentCard'
import { generateButtonYaml } from '@/lib/generateButtonYaml'
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

export default function PowerAppsButtonsPage() {
  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Power Apps Button Components</h1>
        <p className="page-description">
          Browse and copy EDS button components for Power Apps Canvas apps.
          Click the copy button to copy the YAML code to your clipboard, then
          paste it into Power Apps Studio.
        </p>
      </header>

      <section className="components-section">
        <h2>Contained Buttons</h2>
        <div className="components-grid">
          {buttonConfigs
            .filter((config) => config.variant === 'contained')
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
      </section>

      <section className="components-section">
        <h2>Outlined Buttons</h2>
        <div className="components-grid">
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
      </section>

      <section className="components-section">
        <h2>Ghost Buttons</h2>
        <div className="components-grid">
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
      </section>

      <footer className="page-footer">
        <h3>How to Use</h3>
        <ol>
          <li>Click the &quot;Copy YAML&quot; button on any component</li>
          <li>Open Power Apps Studio</li>
          <li>
            Go to Tree View → Click (...) menu → Select &quot;Paste YAML&quot;
          </li>
          <li>Paste the copied content</li>
          <li>The component will appear in your canvas app with EDS styling</li>
        </ol>
      </footer>
    </div>
  )
}
