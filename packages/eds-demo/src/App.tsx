import '@equinor/eds-tokens/css/demo.css'
import './App.css'
import './Box.css'

function App() {
  // Define the color appearances in the same order as in the CSS file
  const colorAppearances = [
    { name: 'neutral', label: 'Neutral' },
    { name: 'accent', label: 'Accent' },
    { name: 'success', label: 'Success' },
    { name: 'info', label: 'Info' },
    { name: 'warning', label: 'Warning' },
    { name: 'danger', label: 'Danger' },
  ]

  // Define the color variables in the order they appear in the CSS
  const colorVariables = [
    'background-app',
    'background-subtle',
    'surface-element',
    'surface-element-hover',
    'surface-element-active',
    'border-separator',
    'border-element',
    'border-element-hover',
    'solid-component',
    'solid-component-hover',
    'solid-component-active',
    'text-low-contrast',
    'text-high-contrast',
  ]

  // Define the typography variations
  const fontSizes = [
    { name: 'xs', label: 'Extra Small' },
    { name: 'sm', label: 'Small' },
    { name: 'md', label: 'Medium' },
    { name: 'lg', label: 'Large' },
  ]

  const fontWeights = [
    { name: 'regular', label: 'Regular' },
    { name: 'bold', label: 'Bold' },
  ]

  const lineHeights = [
    { name: 'normal', label: 'Normal' },
    { name: 'squished', label: 'Squished' },
  ]

  const baselineAlignments = [
    { name: 'true', label: 'Baseline Aligned' },
    { name: 'false', label: 'Center Aligned' },
  ]

  // Generate a sample text with various lengths
  const sampleText = 'The quick brown fox jumps over the lazy dog'

  return (
    <div>
      <article className="text-left mb-12">
        <h2 className="text-4xl mb-10">Selectable spacing</h2>
        <section className="grid gap-14">
          <div data-ratio="squared">
            <h3 className="text-2xl mb-4">Squared</h3>
            <div className="flex items-end align-item gap-4">
              <div className="box flex-none" data-padding="xs">
                <div className="box__inner">xs</div>
              </div>
              <div className="box flex-none" data-padding="sm">
                <div className="box__inner">sm</div>
              </div>
              <div className="box flex-none" data-padding="md">
                <div className="box__inner">md</div>
              </div>
            </div>
          </div>
          <div data-ratio="stretched">
            <h3 className="text-2xl mb-4">Stretched</h3>
            <div className="flex items-end align-item gap-4">
              <div className="box" data-padding="xs">
                <div className="box__inner">xs</div>
              </div>
              <div className="box" data-padding="sm">
                <div className="box__inner">sm</div>
              </div>
              <div className="box" data-padding="md">
                <div className="box__inner">md</div>
              </div>
            </div>
          </div>
          <div data-ratio="squished">
            <h3 className="text-2xl mb-4">Squished</h3>
            <div className="flex items-end align-item gap-4">
              <div className="box" data-padding="xs">
                <div className="box__inner">xs</div>
              </div>
              <div className="box" data-padding="sm">
                <div className="box__inner">sm</div>
              </div>
              <div className="box" data-padding="md">
                <div className="box__inner">md</div>
              </div>
            </div>
          </div>
        </section>
      </article>
      <article className="text-left mb-12">
        <h2 className="text-4xl mb-10">Colors</h2>
        {colorAppearances.map((appearance) => (
          <section
            key={appearance.name}
            className="mb-12"
            data-color-appearance={appearance.name}
          >
            <h3 className="text-2xl mb-6">{appearance.label}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {colorVariables.map((variable) => (
                <div
                  key={variable}
                  className="color-swatch p-6 rounded-lg flex flex-col justify-between h-[120px] shadow"
                  style={{
                    backgroundColor: `var(--eds-color-${variable})`,
                    color: variable.includes('text')
                      ? 'var(--eds-color-background-app)'
                      : variable.includes('background')
                        ? 'var(--eds-color-text-high-contrast)'
                        : 'var(--eds-color-text-high-contrast)',
                  }}
                >
                  <span className="text-sm">--eds-color-{variable}</span>
                </div>
              ))}
            </div>
          </section>
        ))}

        <section className="mb-12">
          <h3 className="text-2xl mb-6">Functional Colors</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              'app-base',
              'app-layer-1',
              'app-layer-2',
              'app-elevated',
              'contrast',
              'focus',
              'link',
            ].map((variable) => (
              <div
                key={variable}
                className="color-swatch p-6 rounded-lg flex flex-col justify-between h-[120px] shadow"
                style={{
                  backgroundColor: `var(--eds-color-functional-${variable})`,
                  color:
                    variable === 'contrast'
                      ? '#000'
                      : 'var(--eds-color-text-high-contrast)',
                }}
              >
                <span className="text-sm">
                  --eds-color-functional-{variable}
                </span>
              </div>
            ))}
          </div>
        </section>
      </article>
      <article className="text-left mb-12">
        <h2 className="text-4xl mb-10">Typography</h2>

        {fontSizes.map((fontSize) => (
          <section key={fontSize.name} className="mb-12">
            <h3 className="text-2xl mb-6">
              {fontSize.label} ({fontSize.name})
            </h3>

            <div className="grid gap-10">
              {fontWeights.map((fontWeight) => (
                <div key={fontWeight.name} className="mb-8">
                  <h4 className="text-xl mb-4">Weight: {fontWeight.label}</h4>

                  {lineHeights.map((lineHeight) => (
                    <div key={lineHeight.name} className="mb-6">
                      <h5 className="text-lg mb-2">
                        Line Height: {lineHeight.label}
                      </h5>

                      <div className="mb-6 grid gap-4">
                        {baselineAlignments.map((alignment) => (
                          <div
                            key={alignment.name}
                            className="p-4 border border-gray-300 rounded"
                          >
                            <p className="mb-2">
                              Baseline Alignment: {alignment.label}
                            </p>
                            <div className="text-sm mb-4">
                              <code
                                className="px-1 rounded"
                                style={{
                                  backgroundColor:
                                    'var(--eds-color-background-subtle)',
                                }}
                              >
                                data-font-size="{fontSize.name}"
                                data-font-weight="{fontWeight.name}"
                                data-line-height="{lineHeight.name}"
                                data-baseline-aligned="{alignment.name}"
                              </code>
                            </div>
                            <div
                              data-font-size={fontSize.name}
                              data-font-weight={fontWeight.name}
                              data-line-height={lineHeight.name}
                              data-baseline-aligned={alignment.name}
                              style={{
                                backgroundColor:
                                  'var(--eds-color-functional-app-layer-1)',
                                padding: '8px',
                                display: 'inline-block',
                              }}
                            >
                              {sampleText}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>
        ))}
      </article>
    </div>
  )
}

export default App
