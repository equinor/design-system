#!/usr/bin/env node

/**
 * Extract prerequisites from package.json files for documentation
 * This script reads the actual package.json files and extracts version requirements
 */

const fs = require('fs')
const path = require('path')

// Define root directory once at module level
const rootDir = path.resolve(__dirname, '..')

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
  // Read key package.json files
  const coreReactPkg = readPackageJson(
    path.join(rootDir, 'packages/eds-core-react/package.json'),
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

  // Extract pnpm version from root package.json packageManager field
  let pnpmVersion = '10.0.0'
  if (rootPkg?.packageManager) {
    const pnpmMatch = rootPkg.packageManager.match(/pnpm@([\d.]+)/)
    if (pnpmMatch) {
      pnpmVersion = pnpmMatch[1]
    }
  }

  const prerequisites = {
    nodejs: nodeVersion,
    pnpm: pnpmVersion,
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

function generateReadmePrerequisites(prerequisites) {
  return `* **Node.js** — Version ${prerequisites.nodejs} or compatible
* **pnpm** — Version ${prerequisites.pnpm} or higher (install globally with \`npm install -g pnpm@${prerequisites.pnpm}\`)
* **Git** — For version control`
}

/**
 * Updates the README.md file with current prerequisite versions
 *
 * @param {Object} prerequisites - The extracted prerequisites object
 * @param {string} prerequisites.nodejs - Node.js version
 * @param {string} prerequisites.pnpm - pnpm version
 * @param {string} rootDir - Absolute path to repository root
 *
 * @returns {void}
 *
 * @description
 * This function:
 * - Reads README.md from the repository root
 * - Finds the Prerequisites section using a flexible regex pattern
 * - Replaces the bullet list with updated versions
 * - Writes the updated content back to README.md
 *
 * Error handling:
 * - Warns and returns if README.md cannot be read
 * - Warns and returns if the Prerequisites pattern is not found
 * - Warns and returns if file write fails
 *
 * The regex pattern matches from "## Prerequisites" through any content
 * until it finds bullet points, allowing flexibility for comments or
 * description text between the heading and the list.
 */
function updateReadme(prerequisites, rootDir) {
  const readmePath = path.join(rootDir, 'README.md')

  // Read README.md
  let readme
  try {
    readme = fs.readFileSync(readmePath, 'utf8')
  } catch (error) {
    console.warn('Could not read README.md:', error.message)
    return
  }

  // Generate the new prerequisites list
  const newPrerequisites = generateReadmePrerequisites(prerequisites)

  // Pattern explanation:
  // Group 1: (## Prerequisites[\s\S]*?) - Captures heading and everything before bullets (non-greedy)
  // Group 2: ((?:\* \*\*[^\n]+\n?)+) - Captures all consecutive bullet point lines
  // This allows for HTML comments, descriptions, or other content between heading and bullets
  const prerequisitesBulletListPattern =
    /(## Prerequisites[\s\S]*?)((?:\* \*\*[^\n]+\n?)+)/

  // Replace the prerequisites bullet list, preserving everything before it
  const updatedReadme = readme.replace(
    prerequisitesBulletListPattern,
    (_, beforeBullets) => beforeBullets + newPrerequisites + '\n',
  )

  // Check if replacement was successful
  if (updatedReadme === readme) {
    console.warn('Warning: Prerequisites list pattern not found in README.md')
    console.warn(
      'The README may need manual updating or the pattern has changed',
    )
    return
  }

  // Write updated README
  try {
    fs.writeFileSync(readmePath, updatedReadme, 'utf8')
    console.log('\n✓ README.md updated successfully')
  } catch (error) {
    console.warn('Could not write README.md:', error.message)
  }
}

// Main execution
if (require.main === module) {
  const prerequisites = extractPrerequisites()

  console.log('Extracted Prerequisites:')
  console.log('=======================')
  console.log(`Node.js: ${prerequisites.nodejs}`)
  console.log(`pnpm: ${prerequisites.pnpm}+`)
  console.log(`React: ${prerequisites.react}+`)
  console.log(`React DOM: ${prerequisites.reactDom}+`)
  console.log(`TypeScript: ${prerequisites.typescript}+ (recommended)`)
  console.log()
  console.log('For documentation:')
  console.log(generatePrerequisitesDoc(prerequisites))

  // Write prerequisites to JSON file
  const outputPath = path.join(rootDir, 'prerequisites.json')
  fs.writeFileSync(outputPath, JSON.stringify(prerequisites, null, 2))
  console.log(`\nPrerequisites written to: ${outputPath}`)

  // Update README.md with extracted prerequisites
  updateReadme(prerequisites, rootDir)
}

module.exports = {
  extractPrerequisites,
  generatePrerequisitesDoc,
  generateReadmePrerequisites,
  updateReadme,
}
