type FontSizeChipProps = {
  /** Font size in pixels */
  size: number
  /** The lightest weight that passes at this size, or `null` when none does */
  minWeightName: string | null
  /** `md` for the larger chips in the step cards */
  chipSize?: 'sm' | 'md'
}

/**
 * One font size from the APCA lookup table: the lightest passing weight in
 * info colours, or struck through when no weight passes at that size.
 */
export function FontSizeChip({
  size,
  minWeightName,
  chipSize = 'sm',
}: FontSizeChipProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded font-mono font-medium text-xs',
        chipSize === 'md' ? 'px-1.5 py-0.5' : 'px-1',
        minWeightName
          ? 'bg-info-muted text-info-on-muted'
          : 'bg-disabled text-disabled line-through',
      ].join(' ')}
    >
      {size}px{minWeightName ? ` ${minWeightName}` : ''}
    </span>
  )
}
