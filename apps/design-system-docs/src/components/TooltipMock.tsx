import type { ReactNode } from 'react'

type TooltipMockProps = {
  title: ReactNode
}

/**
 * Static mock of the EDS tooltip for the /components gallery preview — the
 * real Tooltip only renders on hover/focus, which a preview card can't show.
 * Replace with the /next Tooltip once it can be rendered statically.
 */
export function TooltipMock({ title }: TooltipMockProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 'max-content',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--eds-text-primary)',
          color: 'var(--eds-background-surface)',
          borderRadius: 'var(--eds-corner-radius-rounded)',
          paddingBlock: 'var(--eds-container-space-vertical)',
          paddingInline: 'var(--eds-container-space-horizontal)',
          boxShadow:
            '0px 2px 4px rgba(0,0,0,0.14), 0px 3px 4px rgba(0,0,0,0.12), 0px 1px 5px rgba(0,0,0,0.2)',
          fontFeatureSettings: "'lnum', 'tnum'",
        }}
      >
        {title}
      </div>
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: '6px solid var(--eds-text-primary)',
        }}
      />
    </div>
  )
}

TooltipMock.displayName = 'TooltipMock'
