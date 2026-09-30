'use client'

import type { SemanticColors } from '@/utils/semanticTokens'

type CardPreviewProps = {
  colors: SemanticColors
}

/**
 * Wired to Tokens Studio semantic tokens:
 *   card       → background.surface + border.non-interactive.neutral.muted
 *   accent bar → background.interactive.accent.emphasis.default
 *   tag        → background.interactive.<tone>.muted.default
 *                + text.on-muted.<tone> + border.non-interactive.<tone>.muted
 *   title/body → text.primary / text.secondary
 *   link       → text.interactive.link.default
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
      title: 'Colour Theory in UI',
      body: 'How perceptual colour spaces like OKLCH improve accessibility.',
    },
    {
      concept: 'success',
      tag: 'Engineering',
      title: 'Accessible Palettes',
      body: 'Using Gaussian chroma distribution for balanced colour scales.',
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
            backgroundColor: c['background.surface'],
            borderRadius: '8px',
            border: `1px solid ${c['border.non-interactive.neutral.muted']}`,
            overflow: 'hidden',
          }}
        >
          {/* Accent bar */}
          <div
            style={{
              height: '3px',
              backgroundColor:
                c['background.interactive.accent.emphasis.default'],
            }}
          />

          <div style={{ padding: '16px' }}>
            {/* Tag — the tone's muted fill */}
            <span
              style={{
                display: 'inline-block',
                backgroundColor:
                  c[`background.interactive.${card.concept}.muted.default`],
                color: c[`text.on-muted.${card.concept}`],
                fontSize: '10px',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '4px',
                marginBottom: '10px',
                border: `1px solid ${c[`border.non-interactive.${card.concept}.muted`]}`,
              }}
            >
              {card.tag}
            </span>

            {/* Title */}
            <div
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: c['text.primary'],
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
                color: c['text.secondary'],
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
                color: c['text.interactive.link.default'],
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
