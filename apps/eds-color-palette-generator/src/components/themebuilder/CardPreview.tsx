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
    <div className="grid grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="overflow-hidden rounded border"
          style={{
            backgroundColor: c['background.surface'],
            borderColor: c['border.non-interactive.neutral.muted'],
          }}
        >
          {/* Accent bar */}
          <div
            className="h-[3px]"
            style={{
              backgroundColor:
                c['background.interactive.accent.emphasis.default'],
            }}
          />

          <div className="p-4">
            {/* Tag — the tone's muted fill */}
            <span
              className="mb-2.5 inline-block rounded border px-2 py-0.5 text-xs font-medium"
              style={{
                backgroundColor:
                  c[`background.interactive.${card.concept}.muted.default`],
                color: c[`text.on-muted.${card.concept}`],
                borderColor: c[`border.non-interactive.${card.concept}.muted`],
              }}
            >
              {card.tag}
            </span>

            {/* Title */}
            <div
              className="mb-1.5 text-base leading-[1.3] font-medium"
              style={{ color: c['text.primary'] }}
            >
              {card.title}
            </div>

            {/* Body */}
            <div
              className="mb-3 text-sm leading-normal"
              style={{ color: c['text.secondary'] }}
            >
              {card.body}
            </div>

            {/* Link */}
            <div
              className="text-sm font-medium underline"
              style={{ color: c['text.interactive.link.default'] }}
            >
              Read more
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
