import { readFileSync, writeFileSync } from 'fs'
import path from 'path'

export function mergeLightDarkFoundation({ prefix }: { prefix: string }) {
  const outputDirectory = `${process.cwd()}/build/css/color`

  const lightFoundationPath = path.join(
    outputDirectory,
    'light-color-scheme-trimmed.css',
  )
  const darkFoundationPath = path.join(
    outputDirectory,
    'dark-color-scheme-trimmed.css',
  )
  const mergedFoundationPath = path.join(outputDirectory, 'foundation.css')

  try {
    const lightContent = readFileSync(lightFoundationPath, 'utf-8')
    const darkContent = readFileSync(darkFoundationPath, 'utf-8')

    // Extract CSS variables from light file (excluding the selector)
    const lightVarRegex = new RegExp(`--${prefix}-[^:]+:[^;]+;`, 'g')
    const lightVariables: string[] = lightContent.match(lightVarRegex) ?? []

    // Extract CSS variables from dark file
    const darkVariables: string[] = darkContent.match(lightVarRegex) ?? []

    // Create maps for easier lookup
    const lightVarMap = new Map<string, string>()
    const darkVarMap = new Map<string, string>()

    lightVariables.forEach((variable: string) => {
      const [name, value] = variable.split(':')
      if (name && value) {
        lightVarMap.set(name.trim(), value.replace(';', '').trim())
      }
    })

    darkVariables.forEach((variable: string) => {
      const [name, value] = variable.split(':')
      if (name && value) {
        darkVarMap.set(name.trim(), value.replace(';', '').trim())
      }
    })

    // Create merged variables using light-dark() function
    const mergedVariables: string[] = []

    for (const [varName, lightValue] of lightVarMap) {
      const darkValue = darkVarMap.get(varName)
      if (darkValue) {
        mergedVariables.push(
          `  ${varName}: light-dark(${lightValue}, ${darkValue});`,
        )
      } else {
        // Fallback to light value if dark value doesn't exist
        mergedVariables.push(`  ${varName}: ${lightValue};`)
      }
    }

    // Generate the merged CSS content
    const mergedContent = `:root {
${mergedVariables.join('\n')}
}
`

    writeFileSync(mergedFoundationPath, mergedContent, 'utf-8')
    // eslint-disable-next-line no-console
    console.log(
      `✓ Merged foundation colors with light-dark() function: ${mergedFoundationPath}`,
    )
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error merging light/dark foundation files:', error)
    throw error
  }
}
