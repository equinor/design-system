/** The density a layer has after the migration, which decides the new numbers. */
import { NEW, OLD } from './inventory'

export type Density = 'comfortable' | 'compact' | 'relaxed'

/**
 * A new density mode in force, or the one the legacy mode becomes (Spacious
 * → comfortable, Comfortable → compact), or comfortable, the default of both
 * collections.
 */
export function targetDensity(modes: Record<string, string>): Density {
  const set = modes[NEW.density]
  if (set === 'comfortable' || set === 'compact' || set === 'relaxed') {
    return set
  }
  return modes[OLD.density] === 'Comfortable' ? 'compact' : 'comfortable'
}
