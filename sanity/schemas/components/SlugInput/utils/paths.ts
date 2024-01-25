import { IndexTuple, isIndexSegment, isIndexTuple, isKeySegment, KeyedSegment, Path, PathSegment } from 'sanity'

const rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g
const reKeySegment = /_key\s*==\s*['"](.*)['"]/

export const FOCUS_TERMINATOR = '$'

export function get<R>(obj: unknown, path: Path | string): R | undefined
export function get<R>(obj: unknown, path: Path | string, defaultValue: R): R
export function get(obj: unknown, path: Path | string, defaultVal?: unknown): unknown {
  const select = typeof path === 'string' ? fromString(path) : path
  if (!Array.isArray(select)) {
    throw new Error('Path must be an array or a string')
  }

  let acc: unknown | undefined = obj
  for (let i = 0; i < select.length; i++) {
    const segment = select[i]
    if (isIndexSegment(segment)) {
      if (!Array.isArray(acc)) {
        return defaultVal
      }

      acc = acc[segment]
    }

    if (isKeySegment(segment)) {
      if (!Array.isArray(acc)) {
        return defaultVal
      }

      acc = acc.find((item) => item._key === segment._key)
    }

    if (typeof segment === 'string') {
      acc =
        typeof acc === 'object' && acc !== null
          ? ((acc as Record<string, unknown>)[segment] as Record<string, unknown>)
          : undefined
    }

    if (typeof acc === 'undefined') {
      return defaultVal
    }
  }

  return acc
}

export function fromString(path: string): Path {
  if (typeof path !== 'string') {
    throw new Error('Path is not a string')
  }

  const segments = path.match(rePropName)
  if (!segments) {
    throw new Error('Invalid path string')
  }

  return segments.map(normalizePathSegment)
}

function normalizePathSegment(segment: string): PathSegment {
  if (isIndexSegment(segment)) {
    return normalizeIndexSegment(segment)
  }

  if (isKeySegment(segment)) {
    return normalizeKeySegment(segment)
  }

  if (isIndexTuple(segment)) {
    return normalizeIndexTupleSegment(segment)
  }

  return segment
}

function normalizeIndexSegment(segment: string): PathSegment {
  return Number(segment.replace(/[^\d]/g, ''))
}

function normalizeKeySegment(segment: string): KeyedSegment {
  const segments = segment.match(reKeySegment)
  return { _key: segments![1] }
}

function normalizeIndexTupleSegment(segment: string): IndexTuple {
  const [from, to] = segment.split(':').map((seg) => (seg === '' ? seg : Number(seg)))
  return [from, to]
}
