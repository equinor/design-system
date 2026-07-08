type GeneratedPalette = {
  name: string
  steps: string[]
}

type CardPreviewProps = {
  neutral: string[]
  accent: string[]
  dataColors: GeneratedPalette[]
}

/**
 * Figma token mapping:
 *   neutral[14] card fill        → background/container/card/default (Gray/15 = white)
 *   neutral[3]  border-default   → card stroke (Gray/4)
 *   neutral[8]  text-subtle      → body text (Gray/9)
 *   neutral[11] text-primary     → title (Gray/12)
 *
 *   accent[10]  bg-fill-emphasis → accent bar (MG/11)
 *   accent[12]  text-strong      → link text (MG/13)
 *
 *   dataColor[2]  bg-fill-muted  → tag background
 *   dataColor[3]  border         → tag border
 *   dataColor[11] text           → tag text
 */
export function CardPreview({
  neutral,
  accent,
  dataColors,
}: CardPreviewProps) {
  const cards = [
    {
      tag: 'Technology',
      title: 'Building Design Systems',
      body: 'A comprehensive guide to creating scalable and consistent design tokens.',
    },
    {
      tag: 'Design',
      title: 'Color Theory in UI',
      body: 'How perceptual color spaces like OKLCH improve accessibility.',
    },
    {
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
        {cards.map((card, i) => {
          const tagPalette = dataColors.length > 0
            ? dataColors[i % dataColors.length]
            : null

          return (
            <div
              key={card.title}
              style={{
                backgroundColor: neutral[14],
                borderRadius: '8px',
                border: `1px solid ${neutral[3]}`,
                overflow: 'hidden',
              }}
            >
              {/* Accent bar */}
              <div
                style={{
                  height: '3px',
                  backgroundColor: accent[10],
                }}
              />

              <div style={{ padding: '16px' }}>
                {/* Tag — data color muted fill */}
                <span
                  style={{
                    display: 'inline-block',
                    backgroundColor: tagPalette ? tagPalette.steps[2] : accent[2],
                    color: tagPalette ? tagPalette.steps[12] : accent[12],
                    fontSize: '10px',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    marginBottom: '10px',
                    border: tagPalette
                      ? `1px solid ${tagPalette.steps[5]}`
                      : `1px solid ${accent[5]}`,
                  }}
                >
                  {card.tag}
                </span>

                {/* Title */}
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: neutral[11],
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
                    color: neutral[8],
                    lineHeight: 1.5,
                    marginBottom: '12px',
                  }}
                >
                  {card.body}
                </div>

                {/* Link — accent text */}
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: accent[12],
                    textDecoration: 'underline',
                  }}
                >
                  Read more
                </div>
              </div>
            </div>
          )
        })}
    </div>
  )
}
