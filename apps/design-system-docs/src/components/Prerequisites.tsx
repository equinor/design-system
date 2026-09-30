import React from 'react'
import prerequisites from '../../../../prerequisites.json'

interface PrerequisitesProps {
  minimal?: boolean
}

/**
 * Dynamic Prerequisites component that reads from generated prerequisites.json
 * This ensures prerequisites are always up-to-date with actual package.json requirements
 */
function shortVersion(version: string): string {
  const parts = version.split('.')
  if (version === prerequisites.nodejs || version === prerequisites.react)
    return parts.slice(0, 1).join('.')
  else return parts.slice(0, 2).join('.')
}
export function Prerequisites({ minimal = false }: PrerequisitesProps) {
  if (minimal) {
    return (
      <span>
        Node.js {shortVersion(prerequisites.nodejs)}+, React{' '}
        {shortVersion(prerequisites.react)}+, TypeScript{' '}
        {shortVersion(prerequisites.typescript)}+ <strong>(recommended)</strong>
      </span>
    )
  }

  return <span>{shortVersion(prerequisites.typescript)}+</span>
}

export default Prerequisites
