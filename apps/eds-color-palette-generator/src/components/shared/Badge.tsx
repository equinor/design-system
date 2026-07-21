type BadgeVariant = 'pass-fail' | 'level'

type BadgeProps = {
  pass: boolean
  label: string
  variant?: BadgeVariant
}

export function Badge({ pass, label, variant = 'pass-fail' }: BadgeProps) {
  // EDS concept tokens rather than fixed hex, so pass/fail badges adapt to
  // light and dark mode (the tokens switch under [data-color-scheme=dark]).
  const bgColor = pass
    ? 'var(--eds-color-bg-success-fill-muted-default)'
    : 'var(--eds-color-bg-danger-fill-muted-default)'
  const textColor = pass
    ? 'var(--eds-color-text-success-subtle)'
    : 'var(--eds-color-text-danger-subtle)'

  // Level variant uses info (blue) for informational badges (DECO, AA18)
  const isInfo = variant === 'level' && pass
  const finalBg = isInfo ? 'var(--eds-color-bg-info-fill-muted-default)' : bgColor
  const finalColor = isInfo ? 'var(--eds-color-text-info-subtle)' : textColor

  return (
    <span
      className="inline-flex items-center rounded font-semibold"
      style={{
        padding: '1px 6px',
        fontSize: '10px',
        lineHeight: '18px',
        letterSpacing: '0.02em',
        backgroundColor: finalBg,
        color: finalColor,
      }}
    >
      {label}
    </span>
  )
}
