type ScaleStripProps = {
  /** The 15 colours of a scale, step 1 first */
  colours: string[]
  /** Accessible name for the list, e.g. "Moss Green, light mode" */
  label: string
  /** Steps to outline, e.g. the steps that hold an anchor */
  marked?: number[]
}

/** A generated scale as 15 numbered swatches. */
export function ScaleStrip({ colours, label, marked = [] }: ScaleStripProps) {
  return (
    <ol
      aria-label={label}
      className="m-0 grid list-none grid-cols-15 gap-1 p-0"
    >
      {colours.map((colour, i) => {
        const step = i + 1
        const isMarked = marked.includes(step)
        return (
          <li key={step} className="flex min-w-0 flex-col items-center gap-1">
            <div
              className={[
                'h-12 w-full rounded-sm',
                'border border-muted',
                // Offset, in the text colour, so it shows on any swatch
                isMarked &&
                  'text-primary outline-2 outline-offset-2 outline-current',
              ]
                .filter(Boolean)
                .join(' ')}
              style={{ backgroundColor: colour }}
              title={`Step ${step}: ${colour}`}
            />
            <span
              className={[
                'text-xs',
                isMarked ? 'font-medium text-primary' : 'text-secondary',
              ].join(' ')}
            >
              {step}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
