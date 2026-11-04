'use client'

import { Icon } from '@equinor/eds-core-react/next'
import { chevron_down, search, star_filled } from '@equinor/eds-icons'
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import type { ColorScheme, Density } from '../../../lib/preferences'
import { groupTokens, type Token, type TokenKind } from '../../../lib/tokens'

export const TOKEN_REFERENCE_ID = 'token-reference'

type TokenReferenceProps = {
  open: boolean
  tokenNames: string[]
  /** The previews follow the colour scheme and density of the frame */
  colorScheme: ColorScheme
  density: Density
  onInsert: (name: string) => void
}

/** The kinds whose resolved value is shown next to the name. Colours are
 * left out, so the hex value is not copied instead of the token. */
const SHOWS_VALUE = new Set<TokenKind>([
  'spacing',
  'radius',
  'font-size',
  'line-height',
  'family',
  'weight',
])

function Sample({ token }: { token: Token }) {
  switch (token.kind) {
    case 'text':
    case 'font-size':
    case 'line-height':
    case 'family':
    case 'weight':
      return <span className="token-sample">Ag</span>
    case 'icon':
      return <Icon data={star_filled} size="md" className="token-sample" />
    default:
      return <span className="token-sample" />
  }
}

/** The token reference: every published token, grouped, with a preview in
 * the frame's colour scheme and density. Clicking a token puts it in the
 * CSS at the cursor. */
export function TokenReference({
  open,
  tokenNames,
  colorScheme,
  density,
  onInsert,
}: TokenReferenceProps) {
  const groups = useMemo(() => groupTokens(tokenNames), [tokenNames])
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set())
  const [values, setValues] = useState<Map<string, string>>(() => new Map())
  const list = useRef<HTMLDivElement>(null)

  const filter = query
    .trim()
    .toLowerCase()
    .replace(/^-*(eds-)?/, '')
  const filtered = useMemo(
    () =>
      groups
        .map((group) => ({
          ...group,
          subgroups: group.subgroups
            .map((subgroup) => ({
              ...subgroup,
              tokens: subgroup.tokens.filter((token) =>
                token.name.includes(filter),
              ),
            }))
            .filter((subgroup) => subgroup.tokens.length > 0),
        }))
        .filter((group) => group.subgroups.length > 0),
    [groups, filter],
  )

  // The values depend on the density, so they are read from the previews
  // after each render that can change them.
  useEffect(() => {
    if (!open || !list.current) return
    const next = new Map<string, string>()
    for (const stage of list.current.querySelectorAll<HTMLElement>(
      '.token-stage[data-name]',
    )) {
      next.set(
        stage.dataset.name!,
        getComputedStyle(stage).getPropertyValue('--_token').trim(),
      )
    }
    setValues(next)
  }, [open, density, filtered, expanded])

  const toggle = (id: string, isOpen: boolean) => {
    if (filter) return
    setExpanded((current) => {
      if (current.has(id) === isOpen) return current
      const next = new Set(current)
      if (isOpen) next.add(id)
      else next.delete(id)
      return next
    })
  }

  return (
    <section
      id={TOKEN_REFERENCE_ID}
      className="token-reference"
      aria-label="Token reference"
      hidden={!open}
    >
      <div className="token-reference-header">
        <p className="token-reference-hint">
          Click a token to put it in the CSS at the cursor. The previews follow
          the colour scheme and density of the frame.
        </p>
        <div className="token-filter">
          <Icon data={search} size="md" className="token-filter-icon" />
          <input
            type="search"
            className="token-filter-input"
            placeholder="Filter tokens"
            aria-label="Filter tokens"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>
      <div ref={list} className="token-groups">
        {filtered.length === 0 && (
          <p className="token-empty">No token matches “{query.trim()}”.</p>
        )}
        {filtered.map((group) => {
          const count = group.subgroups.reduce(
            (sum, subgroup) => sum + subgroup.tokens.length,
            0,
          )
          const isOpen = filter !== '' || expanded.has(group.id)
          return (
            <details
              key={group.id}
              className="token-group"
              open={isOpen}
              onToggle={(event) => toggle(group.id, event.currentTarget.open)}
            >
              <summary
                className="token-group-summary"
                // While filtering, every group with a match stays open.
                onClick={(event) => {
                  if (filter) event.preventDefault()
                }}
              >
                <Icon
                  data={chevron_down}
                  size="md"
                  className="token-group-chevron"
                />
                <span>{group.label}</span>
                <span className="token-group-count">{count}</span>
              </summary>
              {isOpen &&
                group.subgroups.map((subgroup) => (
                  <div key={subgroup.label} className="token-subgroup">
                    {subgroup.label && (
                      <p className="token-subgroup-label">{subgroup.label}</p>
                    )}
                    <ul className="token-list">
                      {subgroup.tokens.map((token) => (
                        <li key={token.name}>
                          <button
                            type="button"
                            className="token"
                            data-kind={token.kind}
                            // The name, then the value where one is shown.
                            aria-label={
                              values.get(token.name) &&
                              SHOWS_VALUE.has(token.kind)
                                ? `${token.name}, ${values.get(token.name)}`
                                : token.name
                            }
                            onClick={() => onInsert(token.name)}
                          >
                            <span
                              className="token-stage"
                              data-name={token.name}
                              data-color-scheme={colorScheme}
                              data-density={density}
                              aria-hidden="true"
                              style={
                                {
                                  '--_token': `var(${token.name})`,
                                  '--_backdrop': token.backdrop,
                                  '--_family': token.family,
                                  '--_size': token.size,
                                } as CSSProperties
                              }
                            >
                              <Sample token={token} />
                            </span>
                            <span className="token-name">{token.name}</span>
                            {SHOWS_VALUE.has(token.kind) && (
                              <span className="token-value">
                                {values.get(token.name)}
                              </span>
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </details>
          )
        })}
      </div>
    </section>
  )
}
