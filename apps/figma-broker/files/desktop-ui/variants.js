import R from 'ramda'
import { propName, pickChildren } from '@utils'

const valueToArray = R.mapObjIndexed((value) => [value])

const nameToObject = R.pipe(
  R.split(','),
  R.map(R.compose(R.split('='), R.trim, propName)),
  R.fromPairs,
  valueToArray,
)

export const makeVariant = R.pipe(
  pickChildren,
  R.map((node) => {
    const toObject = nameToObject(node.name)
    return toObject
  }),
  R.reduce(R.mergeWith(R.concat), {}),
  R.mapObjIndexed(R.uniq),
  R.tap(console.log),
)
