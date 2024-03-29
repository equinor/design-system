import * as R from 'ramda'
const removeForbiddenCharacters = (str) => {
  if (str) {
    return str.replace(/[|]|[.]|[-]|[–]|[—]/g, '').replace(/^[0-9]*/, '')
  }
  throw new Error('No string for formatName()!')
}

export const formatName = (str = '') =>
  removeForbiddenCharacters(str)
    .toLowerCase()
    .trim()
    .replace(/[\s+]/g, '-')
    .replace(/[/]/g, '--')
    .replace('___', '--')

export const fixPageName = (name = '') =>
  name
    .replace(/(🚧*)(✅*)/, '')
    .toLowerCase()
    .trim()

export const propName = (str = '') =>
  removeForbiddenCharacters(str)
    .toLowerCase()
    .trim()
    .replace(/[\s+]|[:\s+]/g, '_')
    .replace(/[/]/g, '__')
    .replace('___', '__')

export const pathName = (str = '') =>
  propName(str).replace('__', '-').replace('_', '-')

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
export const toDictDeep = R.curry(R.reduce)(
  (acc, { name, value }) =>
    R.set(
      R.pipe(
        R.split(new RegExp(/(^[^_]+)/)),
        R.filter(isNotEmpty),
        R.map(R.curry(R.replace)(/_*/, '')),
        R.lensPath,
      )(name),
      value,
      acc,
    ),
  {},
)
export const toDictMode = R.curry(R.reduce)(
  (acc, { name, value, mode }) =>
    R.set(
      R.pipe(
        R.split(new RegExp(/(^[^_]+)/)),
        R.filter(isNotEmpty),
        R.map(R.curry(R.replace)(/_*/, '')),
        (path) => (mode === 'default' ? path : ['_modes', mode, ...path]),
        R.lensPath,
      )(name),
      value,
      acc,
    ),
  {},
)

export const isNotNil = R.complement(R.isNil)
export const isNotEmpty = R.complement(R.isEmpty)
export const removeNilAndEmpty = R.curry(R.pickBy)(R.both(isNotEmpty, isNotNil))

export const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

export const mergeStrings = R.reduce((acc, val) => `${acc}${val}`, '')
