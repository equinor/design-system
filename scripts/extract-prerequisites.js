#!/usr/bin/env node

/**
 * Extract prerequisites from package.json files for documentation
 * This script reads the actual package.json files and extracts version requirements
 */

const fs = require('fs')
const path = require('path')

function readPackageJson(packagePath) {
  try {
    const content = fs.readFileSync(packagePath, 'utf8')
    return JSON.parse(content)
  } catch (error) {
    console.warn(`Could not read ${packagePath}:`, error.message)
    return null
  }
}

function extractVersionRequirement(versionString) {
  // Extract the minimum version from version strings like ">=19.0.0", "^5.9.2", "~18.0"
  const match = versionString.match(/[\d.]+/)
  return match ? match[0] : versionString
}

function extractPrerequisites() {
  const rootDir = path.resolve(__dirname, '..')

  // Read key package.json files
  const coreReactPkg = readPackageJson(
    path.join(rootDir, 'packages/eds-core-react/package.json'),
  )
  const docsPkg = readPackageJson(
    path.join(rootDir, 'apps/design-system-docs/package.json'),
  )
  const rootPkg = readPackageJson(path.join(rootDir, 'package.json'))

  // Read .nvmrc for Node.js version
  let nodeVersion = '18.0'
  try {
    const nvmrc = fs.readFileSync(path.join(rootDir, '.nvmrc'), 'utf8').trim()
    nodeVersion = nvmrc
  } catch (error) {
    console.warn('Could not read .nvmrc, using default Node.js version')
  }

  const prerequisites = {
    nodejs: nodeVersion,
    react: 'Unknown',
    typescript: 'Unknown',
    reactDom: 'Unknown',
  }

  // Extract React version from core-react peerDependencies
  if (coreReactPkg?.peerDependencies?.react) {
    const reactVersion = extractVersionRequirement(
      coreReactPkg.peerDependencies.react,
    )
    prerequisites.react = reactVersion
  }

  // Extract React DOM version from core-react peerDependencies
  if (coreReactPkg?.peerDependencies?.['react-dom']) {
    const reactDomVersion = extractVersionRequirement(
      coreReactPkg.peerDependencies['react-dom'],
    )
    prerequisites.reactDom = reactDomVersion
  }

  // Extract TypeScript version from root devDependencies
  if (rootPkg?.devDependencies?.typescript) {
    const tsVersion = extractVersionRequirement(
      rootPkg.devDependencies.typescript,
    )
    prerequisites.typescript = tsVersion
  }

  return prerequisites
}

function generatePrerequisitesDoc(prerequisites) {
  return `Node.js ${prerequisites.nodejs}+, React ${prerequisites.react}+, TypeScript ${prerequisites.typescript}+ (recommended)`
}

// Main execution
if (require.main === module) {
  const prerequisites = extractPrerequisites()

  console.log('Extracted Prerequisites:')
  console.log('=======================')
  console.log(`Node.js: ${prerequisites.nodejs}+`)
  console.log(`React: ${prerequisites.react}+`)
  console.log(`React DOM: ${prerequisites.reactDom}+`)
  console.log(`TypeScript: ${prerequisites.typescript}+ (recommended)`)
  console.log()
  console.log('For documentation:')
  console.log(generatePrerequisitesDoc(prerequisites))

  // Optionally write to a JSON file for Docusaurus to import
  const outputPath = path.join(
    __dirname,
    '..',
    'apps',
    'design-system-docs',
    'prerequisites.json',
  )
  fs.writeFileSync(outputPath, JSON.stringify(prerequisites, null, 2))
  console.log(`\nPrerequisites written to: ${outputPath}`)
}

module.exports = { extractPrerequisites, generatePrerequisitesDoc }
