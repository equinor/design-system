const { Node } = require('ts-morph')
const { stripQuotes } = require('./text')

const fromLibrary = (node) =>
  node.getSourceFile().getFilePath().includes('/node_modules/')

// Props declared in this repo. Props inherited from HTMLAttributes / ViewProps
// live in node_modules and are skipped.
function extractProps(declaration) {
  const props = []
  for (const symbol of declaration.getType().getProperties()) {
    const decl = symbol.getDeclarations()[0]
    if (!decl || !Node.isPropertySignature(decl) || fromLibrary(decl)) continue

    const jsDoc = decl.getJsDocs()[0]
    const description = (jsDoc?.getDescription() ?? '')
      .trim()
      .replace(/\s+/g, ' ')
    const defaultTag = jsDoc
      ?.getTags()
      .find((t) => t.getTagName() === 'default')
    const typeNode = decl.getTypeNode()

    // Expand a reference to a local alias (e.g. BadgeTone) into its members.
    let resolved = typeNode
    const valueNotes = {}
    if (Node.isTypeReference(typeNode)) {
      const name = typeNode.getTypeName()
      const local = Node.isIdentifier(name)
        ? name
            .getSymbol()
            ?.getDeclarations()
            .find((d) => Node.isTypeAliasDeclaration(d) && !fromLibrary(d))
        : undefined
      if (local) {
        resolved = local.getTypeNode()
        // The alias JSDoc lists what each value means, as `- \`value\`: text`.
        const aliasDoc = local.getJsDocs()[0]?.getDescription() ?? ''
        for (const line of aliasDoc.split('\n')) {
          const note = line.match(/^\s*-\s+`([^`]+)`:\s*(.+)$/)
          if (note) valueNotes[note[1]] = note[2].trim()
        }
      }
    }
    const members = Node.isUnionTypeNode(resolved)
      ? resolved.getTypeNodes().map((n) => n.getText().replace(/"/g, "'"))
      : null
    const allLiterals =
      members && resolved.getTypeNodes().every((n) => Node.isLiteralTypeNode(n))

    props.push({
      name: symbol.getName(),
      optional: decl.hasQuestionToken(),
      type: members
        ? members.join(' | ')
        : typeNode.getText().replace(/\s+/g, ' '),
      literals: allLiterals ? members.map(stripQuotes) : null,
      valueNotes,
      default: defaultTag?.getCommentText()?.trim(),
      description,
    })
  }
  return props
}

module.exports = { extractProps }
