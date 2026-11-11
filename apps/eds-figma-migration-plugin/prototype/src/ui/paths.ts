/** How layer paths are written in the window. */

/** The path below an entry: the entry's own name is in the heading already. */
export function pathBelow(
  path: string[],
  entryName: string | undefined,
): string | undefined {
  const below = path[0] === entryName ? path.slice(1) : path
  return below.join(' / ') || undefined
}
