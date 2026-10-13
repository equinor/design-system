// Errors the generator raises on purpose (bad sidecar, missing component,
// stale output). The entry point prints these and exits 1; anything else is a
// bug and keeps its stack trace.
class DocsError extends Error {}

const fail = (message) => {
  throw new DocsError(message)
}

module.exports = { DocsError, fail }
