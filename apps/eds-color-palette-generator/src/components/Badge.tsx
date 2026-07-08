type BadgeVariant = 'pass-fail' | 'level'

type BadgeProps = {
  pass: boolean
  label: string
  variant?: BadgeVariant
}

export function Badge({ pass, label, variant = 'pass-fail' }: BadgeProps) {
  const bgColor = pass ? '#dcfce7' : '#fee2e2'
  const textColor = pass ? '#166534' : '#991b1b'

  // Level variant uses blue for informational badges (DECO, AA18)
  const isInfo = variant === 'level' && pass
  const finalBg = isInfo ? '#dbeafe' : bgColor
  const finalColor = isInfo ? '#1e40af' : textColor

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
