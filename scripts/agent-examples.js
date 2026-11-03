/**
 * Turns the stories of a component into examples an agent can copy, for the
 * agent data (generate-agent-data.js). The Storybook pages keep the stories as
 * they are.
 *
 * A story is written for the Storybook page: it lays the variants out with
 * helpers such as `<Wrapper>` and `<Stack>`, labels them with `<ExampleLabel>`,
 * and may read the controls through its args. Copied as is, that code does not
 * compile in a product's repository. So:
 *
 * - layout helpers are replaced by their children, and labels are removed
 * - a story that reads its args or `useArgs` is left out, since its code shows
 *   what the controls set rather than how to use the component
 * - a story that still uses another component declared in the stories file or
 *   in `.storybook`, such as a density preview, is left out, since the code
 *   needs that component to make sense
 * - a story whose function does more than return JSX, such as calling
 *   `useFieldIds()` first, keeps that code as a function component
 */

const { Project, Node, SyntaxKind } = require('ts-morph')
const { getStoryBody, unwrap } = require('./component-docs/stories')
const { dedent } = require('./component-docs/text')

// Arrange the examples on the page and nothing else, so the children are the
// example.
const LAYOUT_HELPERS = new Set(['Wrapper', 'Stack'])
// Name a variant on the page. The example does not need it.
const LABEL_HELPERS = new Set(['ExampleLabel'])
// Plain elements with page styling, so the element itself is the example.
const ELEMENT_HELPERS = new Map([['UnstyledList', 'ul']])
const HELPERS = new Set([
  ...LAYOUT_HELPERS,
  ...LABEL_HELPERS,
  ...ELEMENT_HELPERS.keys(),
])

const scratch = new Project({
  useInMemoryFileSystem: true,
  compilerOptions: { jsx: 1 },
})

// The function that renders the story: the story itself, or its `render`.
function storyFunction(declaration) {
  const init = unwrap(declaration.getInitializer())
  if (Node.isArrowFunction(init) || Node.isFunctionExpression(init)) return init
  if (!Node.isObjectLiteralExpression(init)) return undefined
  const render = init.getProperty('render')
  if (Node.isMethodDeclaration(render)) return render
  if (Node.isPropertyAssignment(render)) {
    const fn = unwrap(render.getInitializer())
    if (Node.isArrowFunction(fn) || Node.isFunctionExpression(fn)) return fn
  }
  return undefined
}

// Whether the story reads its args: a parameter of the render function used in
// its body, or Storybook's `useArgs`.
function readsArgs(fn) {
  const body = fn?.getBody()
  if (!body) return false
  const parameters = new Set(
    fn
      .getParameters()
      .flatMap((p) => [
        p.getNameNode(),
        ...p.getNameNode().getDescendantsOfKind(SyntaxKind.Identifier),
      ])
      .filter(Node.isIdentifier)
      .map((id) => id.getSymbol())
      .filter(Boolean),
  )
  return body
    .getDescendantsOfKind(SyntaxKind.Identifier)
    .some((id) => id.getText() === 'useArgs' || parameters.has(id.getSymbol()))
}

// Components the examples cannot use outside Storybook: those declared at the
// top of the stories file, and those imported from `.storybook`. The stories
// themselves count too, so a story that renders another story is left out.
function storyOnlyComponents(sf) {
  const names = new Set()
  for (const statement of sf.getVariableStatements()) {
    for (const declaration of statement.getDeclarations()) {
      if (/^[A-Z]/.test(declaration.getName())) names.add(declaration.getName())
    }
  }
  for (const fn of sf.getFunctions()) {
    if (/^[A-Z]/.test(fn.getName() ?? '')) names.add(fn.getName())
  }
  for (const declaration of sf.getImportDeclarations()) {
    if (!declaration.getModuleSpecifierValue().includes('.storybook')) continue
    for (const named of declaration.getNamedImports())
      names.add(named.getName())
  }
  return names
}

const tagName = (element) =>
  (Node.isJsxElement(element) ? element.getOpeningElement() : element)
    .getTagNameNode()
    .getText()

const isJsx = (node) =>
  Node.isJsxElement(node) ||
  Node.isJsxSelfClosingElement(node) ||
  Node.isJsxFragment(node)

// Replaces every helper element in `text` by its children, or by nothing for a
// label, outermost first. An unwrapped helper that is not inside other JSX,
// such as the one a function returns, keeps its children in a fragment.
function removeHelpers(text) {
  let current = text
  for (;;) {
    const sf = scratch.createSourceFile('example.tsx', current, {
      overwrite: true,
    })
    const element = sf
      .getDescendants()
      .find(
        (node) =>
          (Node.isJsxElement(node) || Node.isJsxSelfClosingElement(node)) &&
          HELPERS.has(tagName(node)),
      )
    if (!element) return current

    const plainElement = ELEMENT_HELPERS.get(tagName(element))
    if (plainElement) {
      const tags = Node.isJsxElement(element)
        ? [
            element.getClosingElement().getTagNameNode(),
            element.getOpeningElement().getTagNameNode(),
          ]
        : [element.getTagNameNode()]
      for (const tag of tags) {
        current =
          current.slice(0, tag.getStart()) +
          plainElement +
          current.slice(tag.getEnd())
      }
      continue
    }

    let replacement = ''
    if (Node.isJsxElement(element) && LAYOUT_HELPERS.has(tagName(element))) {
      const inner = current.slice(
        element.getOpeningElement().getEnd(),
        element.getClosingElement().getStart(),
      )
      const children = element.getJsxChildren().filter(isJsx)
      const column = sf.getLineAndColumnAtPos(element.getStart()).column - 1
      const pad = ' '.repeat(column)
      const body = inner.trim() ? dedent(inner) : ''
      const insideJsx = isJsx(element.getParent())
      replacement =
        insideJsx || children.length === 1
          ? body.split('\n').join(`\n${pad}`)
          : `<>\n${pad}  ${body.split('\n').join(`\n${pad}  `)}\n${pad}</>`
    }
    current =
      current.slice(0, element.getStart()) +
      replacement +
      current.slice(element.getEnd())
  }
}

// Blank lines left where a label was.
const tidy = (text) =>
  text
    .replace(/\n[ \t]+\n/g, '\n\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\(\n\n/g, '(\n')
    .replace(/>\n\n(\s*)</g, '>\n$1<')

// The story as an example, or undefined when it does not stand on its own.
function toExample(story) {
  const { declaration, code } = story
  if (!code) return undefined
  const fn = storyFunction(declaration)
  if (readsArgs(fn)) return undefined

  let text
  const body = getStoryBody(declaration)
  const statements = Node.isBlock(body) ? body.getStatements() : []
  if (statements.some((s) => !Node.isReturnStatement(s))) {
    const sf = declaration.getSourceFile()
    const inner = sf.getFullText().slice(body.getStart() + 1, body.getEnd() - 1)
    text = `function ${story.name}() {\n${dedent(inner)
      .split('\n')
      .map((line) => (line ? `  ${line}` : line))
      .join('\n')}\n}`
    text = tidy(removeHelpers(text))
  } else {
    const wrapped = removeHelpers(`const __example = (\n<>\n${code}\n</>\n)\n`)
    const sf = scratch.createSourceFile('example.tsx', wrapped, {
      overwrite: true,
    })
    const fragment = sf.getFirstDescendantByKind(SyntaxKind.JsxFragment)
    text = tidy(
      dedent(
        wrapped.slice(
          fragment.getOpeningFragment().getEnd(),
          fragment.getClosingFragment().getStart(),
        ),
      ),
    )
  }

  const storyOnly = storyOnlyComponents(declaration.getSourceFile())
  const check = scratch.createSourceFile(
    'example.tsx',
    text.startsWith('function ') ? text : `const __e = <>\n${text}\n</>`,
    { overwrite: true },
  )
  const usesStoryOnly = check
    .getDescendants()
    .filter(
      (n) => Node.isJsxOpeningElement(n) || Node.isJsxSelfClosingElement(n),
    )
    .some((n) => storyOnly.has(n.getTagNameNode().getText().split('.')[0]))
  if (usesStoryOnly) return undefined

  return text
}

module.exports = { toExample, HELPERS }
