/**
 * Codemod to migrate TextField with multiline prop to Textarea component
 *
 * Usage:
 *   npx jscodeshift -t textfield-to-textarea.codemod.js --parser=tsx src/
 *
 * This codemod:
 * 1. Finds TextField components with multiline={true} or multiline prop
 * 2. Replaces TextField with Textarea
 * 3. Removes the multiline prop
 * 4. Renames textareaRef to ref
 * 5. Updates imports
 */

module.exports = function transformer(file, api) {
  const j = api.jscodeshift
  const root = j(file.source)
  let hasChanges = false

  // Track if we need to update imports
  let hasTextFieldSingleLine = false
  let changeCount = 0
  let textareaRefRenames = 0

  // Find TextField components with multiline prop
  const textFieldsWithMultiline = root.find(j.JSXElement).filter((path) => {
    const openingElement = path.value.openingElement
    const elementName = openingElement.name

    // Check if it's a TextField
    if (
      elementName.type === 'JSXIdentifier' &&
      elementName.name === 'TextField'
    ) {
      // Check if it has multiline prop
      const hasMultiline = openingElement.attributes.some((attr) => {
        if (attr.type === 'JSXAttribute' && attr.name.name === 'multiline') {
          // multiline={true} or just multiline
          if (
            attr.value === null ||
            (attr.value.type === 'JSXExpressionContainer' &&
              attr.value.expression.type === 'BooleanLiteral' &&
              attr.value.expression.value === true) ||
            (attr.value.type === 'JSXExpressionContainer' &&
              attr.value.expression.type === 'Literal' &&
              attr.value.expression.value === true)
          ) {
            return true
          }
        }
        return false
      })

      if (!hasMultiline) {
        hasTextFieldSingleLine = true
      }

      return hasMultiline
    }
    return false
  })

  textFieldsWithMultiline.forEach((path) => {
    const openingElement = path.value.openingElement
    const closingElement = path.value.closingElement

    // Change component name from TextField to Textarea
    openingElement.name.name = 'Textarea'
    if (closingElement) {
      closingElement.name.name = 'Textarea'
    }

    // Remove multiline prop
    openingElement.attributes = openingElement.attributes.filter((attr) => {
      if (attr.type === 'JSXAttribute' && attr.name.name === 'multiline') {
        return false
      }
      return true
    })

    // Rename textareaRef to ref
    openingElement.attributes = openingElement.attributes.map((attr) => {
      if (attr.type === 'JSXAttribute' && attr.name.name === 'textareaRef') {
        attr.name.name = 'ref'
        textareaRefRenames++
      }
      return attr
    })

    changeCount++
    hasChanges = true
  })

  // Update imports
  if (hasChanges) {
    // Find the import declaration for TextField
    root
      .find(j.ImportDeclaration)
      .filter((path) => {
        const specifiers = path.value.specifiers || []
        return specifiers.some(
          (spec) =>
            spec.type === 'ImportSpecifier' &&
            spec.imported.name === 'TextField',
        )
      })
      .forEach((path) => {
        const specifiers = path.value.specifiers || []

        // Check if Textarea is already imported
        const hasTextarea = specifiers.some(
          (spec) =>
            spec.type === 'ImportSpecifier' &&
            spec.imported.name === 'Textarea',
        )

        if (!hasTextarea) {
          // Add Textarea to imports
          path.value.specifiers.push(
            j.importSpecifier(j.identifier('Textarea')),
          )
        }

        // Remove TextField if no single-line usage
        if (!hasTextFieldSingleLine) {
          path.value.specifiers = specifiers.filter(
            (spec) =>
              !(
                spec.type === 'ImportSpecifier' &&
                spec.imported.name === 'TextField'
              ),
          )

          // If no specifiers left, remove the entire import
          if (path.value.specifiers.length === 0) {
            j(path).remove()
          }
        }
      })

    // Log the changes made
    console.log(`✓ ${file.path}`)
    console.log(
      `  - Converted ${changeCount} TextField${changeCount !== 1 ? 's' : ''} with multiline prop to Textarea`,
    )
    if (textareaRefRenames > 0) {
      console.log(
        `  - Renamed ${textareaRefRenames} textareaRef prop${textareaRefRenames !== 1 ? 's' : ''} to ref`,
      )
    }
    if (!hasTextFieldSingleLine) {
      console.log(`  - Removed TextField from imports (no single-line usage)`)
    } else {
      console.log(
        `  - Kept TextField import (still used for single-line fields)`,
      )
    }
  }

  return hasChanges ? root.toSource({ quote: 'single' }) : null
}

module.exports.parser = 'tsx'
