import React, { Fragment, useEffect, useRef, useState } from 'react'

const SIZES = [
  '6xl',
  '5xl',
  '4xl',
  '3xl',
  '2xl',
  'xl',
  'lg',
  'md',
  'sm',
  'xs',
] as const

type Size = (typeof SIZES)[number]
type Family = 'ui-body' | 'header'

const FAMILY_LABEL = {
  'ui-body': 'Inter — body / UI',
  header: 'Equinor — headings',
} as const

const FAMILY_FONT = {
  'ui-body': 'Inter, sans-serif',
  header: 'Equinor, sans-serif',
} as const

const SAMPLE = {
  'ui-body': "I'm body text",
  header: "I'm a heading",
} as const

function formatPx(px: number): string {
  return `${Number.isInteger(px) ? px : px.toFixed(1)}px`
}

function Specimen({ size, family }: { size: Size; family: Family }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [px, setPx] = useState<string>('')

  useEffect(() => {
    if (!ref.current) return
    setPx(formatPx(parseFloat(getComputedStyle(ref.current).fontSize)))
  }, [size, family])

  return (
    <>
      <code className="specimen-label">{px}</code>
      <span
        ref={ref}
        style={{
          fontSize: `var(--eds-typography-${family}-${size}-font-size)`,
          fontFamily: FAMILY_FONT[family],
          whiteSpace: 'nowrap',
        }}
      >
        {SAMPLE[family]}
      </span>
    </>
  )
}

export function TypeSpecimen() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '3rem auto 1fr auto 1fr',
        columnGap: '1rem',
        rowGap: '0.75rem',
        alignItems: 'baseline',
        padding: '1.5rem',
        border: '1px solid var(--ifm-color-emphasis-300)',
        borderRadius: '8px',
        margin: '1rem 0',
        overflowX: 'auto',
      }}
    >
      <code className="specimen-label">step</code>
      <code className="specimen-label" />
      <span
        className="specimen-label"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {FAMILY_LABEL['ui-body']}
      </span>
      <code className="specimen-label" />
      <span
        className="specimen-label"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {FAMILY_LABEL.header}
      </span>

      {SIZES.map((size) => (
        <Fragment key={size}>
          <code className="specimen-label">{size}</code>
          <Specimen size={size} family="ui-body" />
          <Specimen size={size} family="header" />
        </Fragment>
      ))}
    </div>
  )
}

export default TypeSpecimen
