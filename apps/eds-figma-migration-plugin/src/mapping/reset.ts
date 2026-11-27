/**
 * The target of a Manual fix the plugin can make once a designer accepts it
 * in Review: reset the layer inside the instance so it takes its size from
 * the main component again, swap it back if it was a swapped icon, and put
 * its other changes back. Written `reset:spacing/md` when the main component
 * binds that EDS Beta variable there, or `reset:` when it uses a number.
 */
const PREFIX = 'reset:'

export function resetTarget(variable: string | undefined): string {
  return `${PREFIX}${variable ?? ''}`
}

export function isResetTarget(target: string | null | undefined): boolean {
  return target?.startsWith(PREFIX) ?? false
}

/** The EDS Beta variable a reset gives, or undefined for the main component's number. */
export function resetVariable(target: string): string | undefined {
  return target.slice(PREFIX.length) || undefined
}

/** What a reset gives, as the window and the report say it. */
export function resetText(target: string): string {
  const variable = resetVariable(target)
  return `${variable ?? "The main component's size"}, by resetting the layer`
}
