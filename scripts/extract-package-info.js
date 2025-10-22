#!/usr/bin/env node

const { readFileSync, writeFileSync, existsSync } = require('fs')
const { join } = require('path')

// Define the packages we want to include (public packages only)
const PUBLIC_PACKAGES = [
  'eds-core-react',
  'eds-tokens',
  'eds-icons',
  'eds-data-grid-react',
  'eds-utils',
  'eds-lab-react',
]

function extractPackageInfo() {
  const packages = []

  for (const packageName of PUBLIC_PACKAGES) {
    try {
      const packageDir = join(__dirname, '..', 'packages', packageName)
      const packageJsonPath = join(packageDir, 'package.json')
      const changelogPath = join(packageDir, 'CHANGELOG.md')

      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))

      // Generate changelog link
      let changelogLink = 'N/A'
      if (existsSync(changelogPath)) {
        // Create GitHub link to the changelog file
        const repoUrl =
          packageJson.repository?.url ||
          'https://github.com/equinor/design-system'
        const directory =
          packageJson.repository?.directory || `packages/${packageName}`
        changelogLink = `${repoUrl.replace('.git', '')}/blob/main/${directory}/CHANGELOG.md`
      }

      packages.push({
        name: packageJson.name,
        version: packageJson.version,
        npmLink: `https://www.npmjs.com/package/${packageJson.name}`,
        changelogLink: changelogLink,
      })
    } catch (error) {
      console.warn(
        `Warning: Could not read package info for ${packageName}:`,
        error.message,
      )
    }
  }

  return packages
}

function generatePackageTable(packages) {
  const tableHeader = `## Available Packages

| Name | Version | npm link | Changelog |
|------|---------|----------|-----------|`

  const tableRows = packages
    .map((pkg) => {
      const changelogCell =
        pkg.changelogLink === 'N/A'
          ? 'N/A'
          : `[changelog](${pkg.changelogLink})`

      return `| ${pkg.name} | ${pkg.version} | [${pkg.name}](${pkg.npmLink}) | ${changelogCell} |`
    })
    .join('\n')

  return `${tableHeader}\n${tableRows}`
}

function updateResourcesFile(newPackageTable) {
  const resourcesPath = join(
    __dirname,
    '..',
    'apps',
    'design-system-docs',
    'docs',
    'resources',
    'resources.md',
  )

  try {
    let content = readFileSync(resourcesPath, 'utf8')
    const originalContent = content

    // Replace the existing Available Packages section
    const packageSectionRegex = /## Available Packages[\s\S]*?(?=\n## |\n$)/

    if (packageSectionRegex.test(content)) {
      content = content.replace(packageSectionRegex, newPackageTable)
    } else {
      console.warn(
        'Warning: Could not find Available Packages section to replace',
      )
      return { updated: false, hasChanges: false }
    }

    // Check if content actually changed
    const hasChanges = originalContent !== content

    if (hasChanges) {
      writeFileSync(resourcesPath, content, 'utf8')
      console.log('✅ Successfully updated package information in resources.md')
      return { updated: true, hasChanges: true }
    } else {
      console.log('ℹ️  Package information is already up-to-date')
      return { updated: false, hasChanges: false }
    }
  } catch (error) {
    console.error('Error updating resources file:', error.message)
    process.exit(1)
  }
}

function main() {
  console.log('📦 Extracting package information...')

  const packages = extractPackageInfo()

  if (packages.length === 0) {
    console.error('Error: No package information found')
    process.exit(1)
  }

  console.log(
    `Found ${packages.length} packages:`,
    packages.map((p) => `${p.name}@${p.version}`).join(', '),
  )

  const newPackageTable = generatePackageTable(packages)
  const result = updateResourcesFile(newPackageTable)

  // Exit with code 1 if there were changes (useful for CI/CD)
  // Exit with code 0 if no changes (normal operation)
  if (result.hasChanges) {
    console.log('🔄 Package documentation has been updated')
    process.exit(1) // Non-zero exit indicates changes were made
  } else {
    console.log('✨ Package documentation is current')
    process.exit(0) // Zero exit indicates no changes needed
  }
}

main()
