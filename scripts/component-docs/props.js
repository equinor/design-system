const { Node } = require('ts-morph')

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

    // Expand a reference to a local alias (e.g. BadgeTone) into its members, so
    // the type column lists the allowed values.
    let resolved = typeNode
    if (Node.isTypeReference(typeNode)) {
      const name = typeNode.getTypeName()
      const local = Node.isIdentifier(name)
        ? name
            .getSymbol()
            ?.getDeclarations()
            .find((d) => Node.isTypeAliasDeclaration(d) && !fromLibrary(d))
        : undefined
      if (local) resolved = local.getTypeNode()
    }
    const members = Node.isUnionTypeNode(resolved)
      ? resolved.getTypeNodes().map((n) => n.getText().replace(/"/g, "'"))
      : null

    props.push({
      name: symbol.getName(),
      optional: decl.hasQuestionToken(),
      type: members
        ? members.join(' | ')
        : typeNode.getText().replace(/\s+/g, ' '),
      default: defaultTag?.getCommentText()?.trim(),
      description,
    })
  }
  return props
}

module.exports = { extractProps }
