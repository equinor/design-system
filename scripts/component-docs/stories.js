const { SyntaxKind, Node } = require('ts-morph')
const { humanise, dedent } = require('./text')

// The `parameters.docs.description.story` text of a story, whether it is set in
// the story object or assigned afterwards as `Story.parameters = {...}`.
function getStoryCaption(sf, declaration) {
  const name = declaration.getName()
  const init = declaration.getInitializer()
  let params
  if (Node.isObjectLiteralExpression(init)) {
    const p = init.getProperty('parameters')
    params = p && Node.isPropertyAssignment(p) ? p.getInitializer() : undefined
  }
  if (!params) {
    const assignment = sf
      .getDescendantsOfKind(SyntaxKind.BinaryExpression)
      .find((b) => b.getLeft().getText() === `${name}.parameters`)
    params = assignment?.getRight()
  }
  let cur = params
  for (const key of ['docs', 'description', 'story']) {
    if (!cur || !Node.isObjectLiteralExpression(cur)) return undefined
    const prop = cur.getProperty(key)
    cur = prop && Node.isPropertyAssignment(prop) ? prop.getInitializer() : null
  }
  return cur &&
    (Node.isStringLiteral(cur) || Node.isNoSubstitutionTemplateLiteral(cur))
    ? cur.getLiteralText()
    : undefined
}

// Strips `as`, `satisfies` and parentheses around a story.
function unwrap(node) {
  let current = node
  while (
    Node.isParenthesizedExpression(current) ||
    Node.isAsExpression(current) ||
    Node.isSatisfiesExpression(current)
  ) {
    current = current.getExpression()
  }
  return current
}

// A story is a function that returns JSX, or an object (CSF3). Other exports
// in a stories file, such as helper constants, are not examples.
const isStory = (init) =>
  Node.isArrowFunction(init) ||
  Node.isFunctionExpression(init) ||
  Node.isObjectLiteralExpression(init)

// The body of a function story, or of the `render` function of an object story.
function getStoryBody(declaration) {
  const init = unwrap(declaration.getInitializer())
  if (!Node.isObjectLiteralExpression(init)) return init?.getBody?.()
  const render = init.getProperty('render')
  if (Node.isMethodDeclaration(render)) return render.getBody()
  if (Node.isPropertyAssignment(render)) {
    return unwrap(render.getInitializer())?.getBody?.()
  }
  return undefined
}

// The JSX a story returns, as source text. A fragment contributes its children.
function getStoryCode(sf, declaration) {
  let body = getStoryBody(declaration)
  if (Node.isBlock(body)) {
    body = body
      .getFirstDescendantByKind(SyntaxKind.ReturnStatement)
      ?.getExpression()
  }
  while (Node.isParenthesizedExpression(body)) body = body.getExpression()
  if (!body) return undefined
  if (Node.isJsxFragment(body)) {
    return dedent(
      sf
        .getFullText()
        .slice(
          body.getOpeningFragment().getEnd(),
          body.getClosingFragment().getStart(),
        ),
    )
  }
  const column = sf.getLineAndColumnAtPos(body.getStart()).column - 1
  return dedent(' '.repeat(column) + body.getText())
}

function extractStories(project, file, skip) {
  const sf = project.addSourceFileAtPath(file)
  const stories = []
  for (const statement of sf.getVariableStatements()) {
    if (!statement.isExported()) continue
    for (const declaration of statement.getDeclarations()) {
      const name = declaration.getName()
      if (skip.has(name)) continue
      if (!isStory(unwrap(declaration.getInitializer()))) continue
      stories.push({
        name,
        title: humanise(name),
        caption: getStoryCaption(sf, declaration),
        code: getStoryCode(sf, declaration),
      })
    }
  }
  return stories
}

module.exports = { extractStories }
