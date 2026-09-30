type BadgeVariant = 'pass-fail' | 'level'

type BadgeProps = {
  pass: boolean
  label: string
  variant?: BadgeVariant
}

// Tokens Studio status roles (muted fill + on-muted text), so the badges
// follow the colour scheme.
const PASS = 'bg-success-muted text-success-on-muted'
const FAIL = 'bg-danger-muted text-danger-on-muted'
// Informational levels (DECO, AA18) use the info tone
const INFO = 'bg-info-muted text-info-on-muted'

export function Badge({ pass, label, variant = 'pass-fail' }: BadgeProps) {
  const isInfo = variant === 'level' && pass
  const tone = isInfo ? INFO : pass ? PASS : FAIL

  return (
    <span
      className={`inline-flex items-center rounded px-1.5 text-xs leading-[18px] font-medium tracking-[0.02em] ${tone}`}
    >
      {label}
    </span>
  )
}
