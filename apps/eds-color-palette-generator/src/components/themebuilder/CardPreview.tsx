'use client'

import type { SemanticColors } from '@/config/semanticColors'

type CardPreviewProps = {
  colors: SemanticColors
}

/**
 * Wired to canonical EDS semantic tokens (Figma Color Map):
 *   card      → bg-neutral-surface + border-neutral-subtle
 *   accent bar→ bg-accent-fill-emphasis-default
 *   tag       → bg-{concept}-fill-muted-default + text-{concept}-subtle + border-{concept}-subtle
 *   title/body→ text-neutral-strong / text-neutral-subtle
 *   link      → text-link
 */
export function CardPreview({ colors: c }: CardPreviewProps) {
  const cards = [
    {
      concept: 'info',
      tag: 'Technology',
      title: 'Building Design Systems',
      body: 'A comprehensive guide to creating scalable and consistent design tokens.',
    },
    {
      concept: 'accent',
      tag: 'Design',
      title: 'Color Theory in UI',
      body: 'How perceptual color spaces like OKLCH improve accessibility.',
    },
    {
      concept: 'success',
      tag: 'Engineering',
      title: 'Accessible Palettes',
      body: 'Using Gaussian chroma distribution for balanced color scales.',
    },
  ]

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
      }}
    >
      {cards.map((card) => (
        <div
          key={card.title}
          style={{
            backgroundColor: c['bg-neutral-surface'],
            borderRadius: '8px',
            border: `1px solid ${c['border-neutral-subtle']}`,
            overflow: 'hidden',
          }}
        >
          {/* Accent bar */}
          <div
            style={{
              height: '3px',
              backgroundColor: c['bg-accent-fill-emphasis-default'],
            }}
          />

          <div style={{ padding: '16px' }}>
            {/* Tag — concept muted fill */}
            <span
              style={{
                display: 'inline-block',
                backgroundColor: c[`bg-${card.concept}-fill-muted-default`],
                color: c[`text-${card.concept}-subtle`],
                fontSize: '10px',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '4px',
                marginBottom: '10px',
                border: `1px solid ${c[`border-${card.concept}-subtle`]}`,
              }}
            >
              {card.tag}
            </span>

            {/* Title */}
            <div
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: c['text-neutral-strong'],
                marginBottom: '6px',
                lineHeight: 1.3,
              }}
            >
              {card.title}
            </div>

            {/* Body */}
            <div
              style={{
                fontSize: '12px',
                color: c['text-neutral-subtle'],
                lineHeight: 1.5,
                marginBottom: '12px',
              }}
            >
              {card.body}
            </div>

            {/* Link */}
            <div
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: c['text-link'],
                textDecoration: 'underline',
              }}
            >
              Read more
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
