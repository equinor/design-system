const { Node } = require('ts-morph')

const fromLibrary = (node) =>
  node.getSourceFile().getFilePath().includes('/node_modules/')

// Props declared in this repo. Props inherited from HTMLAttributes / ViewProps
// live in node_modules and are skipped.
function extractProps(declaration) {
  const props = []
  for (const symbol of declaration.getType().getProperties()) {
    // A prop redeclared in this repo is also declared in the library type it is
    // intersected with, and which declaration comes first depends on the order
    // of the intersection. Take the one from this repo wherever it sits.
    const decl = symbol
      .getDeclarations()
      .find((d) => Node.isPropertySignature(d) && !fromLibrary(d))
    if (!decl) continue

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

const fromReactNative = (node) =>
  node.getSourceFile().getFilePath().includes('/node_modules/react-native/')

// Type helpers that pass a props type through, so `Omit<TextInputProps, 'x'>`
// still builds on TextInputProps. Pick is left out on purpose: it keeps only a
// few of the props, so the type does not accept all of them.
const PASS_THROUGH = new Set(['Omit', 'Partial', 'Required'])

// The string keys named in an Omit, such as `'a' | 'b'`, or none.
function literalKeys(typeNode) {
  if (!typeNode) return []
  if (Node.isLiteralTypeNode(typeNode)) {
    return [
      typeNode
        .getLiteral()
        .getText()
        .replace(/^['"]|['"]$/g, ''),
    ]
  }
  if (Node.isUnionTypeNode(typeNode)) {
    return typeNode.getTypeNodes().flatMap(literalKeys)
  }
  return []
}

// The React Native prop types that a props type is built from, such as
// PressableProps or ViewProps, each with the keys an Omit removed from it. Their
// props are not listed in the table, so the page names them instead. Only the
// top level of the type counts, through `&`, local aliases and the helpers
// above, so a type that merely borrows one prop, like `TextProps['onPress']`,
// does not claim to accept all of TextProps.
function extractBaseTypes(declaration) {
  const bases = new Map()
  const seen = new Set()

  const visit = (typeNode, omitted = []) => {
    if (!typeNode || seen.has(typeNode)) return
    seen.add(typeNode)

    if (Node.isIntersectionTypeNode(typeNode)) {
      typeNode.getTypeNodes().forEach((node) => visit(node, omitted))
    } else if (Node.isParenthesizedTypeNode(typeNode)) {
      visit(typeNode.getTypeNode(), omitted)
    } else if (Node.isTypeReference(typeNode)) {
      const name = typeNode.getTypeName()
      if (!Node.isIdentifier(name)) return
      let symbol = name.getSymbol()
      if (symbol?.isAlias()) symbol = symbol.getAliasedSymbol()
      for (const decl of symbol?.getDeclarations() ?? []) {
        if (fromReactNative(decl)) {
          const base = name.getText()
          if (/Props$/.test(base) && !bases.has(base)) bases.set(base, omitted)
        } else if (fromLibrary(decl)) {
          const helper = name.getText()
          if (PASS_THROUGH.has(helper)) {
            const [inner, keys] = typeNode.getTypeArguments()
            visit(
              inner,
              helper === 'Omit' ? [...omitted, ...literalKeys(keys)] : omitted,
            )
          }
        } else if (Node.isTypeAliasDeclaration(decl)) {
          visit(decl.getTypeNode(), omitted)
        }
      }
    }
  }

  visit(
    Node.isTypeAliasDeclaration(declaration)
      ? declaration.getTypeNode()
      : undefined,
  )
  return [...bases].map(([name, omitted]) => ({ name, omitted }))
}

module.exports = { extractProps, extractBaseTypes }
