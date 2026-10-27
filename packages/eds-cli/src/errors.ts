/**
 * An error the CLI raises on purpose, such as a missing package or an unknown
 * component. `main` prints its message and exits 1; anything else is a bug and
 * keeps its stack trace.
 */
export class CliError extends Error {}

export const fail = (message: string): never => {
  throw new CliError(message)
}
