import * as R from 'ramda'

const head = R.pipe(
  R.defaultTo([]),
  R.head,
)

const removeForbiddenCharacters = (str) => {
  if (str) {
    return str.replace(/[|]|[.]|[-]|[–]|[—]/g, '')
  }
  throw new Error('No string for formatName()!')
}

export const formatName = (str) =>
  removeForbiddenCharacters(str)
    .toLowerCase()
    .trim()
    .replace(/[\s+]/g, '-')
    .replace(/[/]/g, '--')
    .replace('___', '--')

export const fixPageName = (name) =>
  name
    .replace(/(🚧*)(✅*)/, '')
    .toLowerCase()
    .trim()

export const propName = (str) =>
  removeForbiddenCharacters(str)
    .toLowerCase()
    .trim()
    .replace(/[\s+]/g, '_')
    .replace(/[/]/g, '__')
    .replace('___', '__')

export const withName = R.curry((regExp, node) =>
  R.test(new RegExp(regExp, 'i'), node.name),
)

export const withType = R.curry((regExp, node) =>
  R.test(new RegExp(regExp, 'i'), node.type),
)

export const pickChildren = R.curry(R.reduce)(
  (acc, x) => [...acc, ...(x.children || [])],
  [],
)

export const toDict = R.curry(R.reduce)(
  (acc, { name, value }) => ({
    ...acc,
    [name]: value,
  }),
  {},
)

export const instanceOfComponent = (name) =>
  R.curry((x) => withName(name, head(x.children) || { name: '' }))

export const isNotNil = R.complement(R.isNil)
export const isNotEmpty = R.complement(R.isEmpty)
export const removeNilAndEmpty = R.curry(R.pickBy)(R.both(isNotEmpty, isNotNil))
