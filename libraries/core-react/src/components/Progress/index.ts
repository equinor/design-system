export * from './Linear/LinearProgress'
export * from './Circular/CircularProgress'
export * from './Star/StarProgress'
export * from './Dots/DotProgress'

import { LinearProgress } from './Linear/LinearProgress'
import { CircularProgress } from './Circular/CircularProgress'
import { StarProgress } from './Star/StarProgress'
import { DotProgress } from './Dots/DotProgress'

type ProgressCompoundProps = {
  Linear: typeof LinearProgress
  Circular: typeof CircularProgress
  Star: typeof StarProgress
  Dot: typeof DotProgress
}

export const Progress: ProgressCompoundProps = {
  Linear: LinearProgress,
  Circular: CircularProgress,
  Star: StarProgress,
  Dot: DotProgress,
}
