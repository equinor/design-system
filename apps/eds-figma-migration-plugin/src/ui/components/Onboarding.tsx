import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Badge, Button, Dialog, Icon } from '@equinor/eds-core-react/next'
import { arrow_down, check_circle_outlined, lock } from '@equinor/eds-icons'
import { HealthBar } from './HealthBar'

type OnboardingProps = {
  open: boolean
  /** Closes the introduction; true when the designer chose to scan the page */
  onClose: (scanPage: boolean) => void
}

type Step = {
  id: string
  title: string
  hero: ReactNode
  body: ReactNode
}

/** A token as the window shows it: a swatch and its name, with the library above. */
function TokenCard({
  library,
  name,
  colour,
}: {
  library: string
  name: string
  colour: string
}) {
  return (
    <span className="intro-token">
      <span className="intro-token-library">{library}</span>
      <span className="intro-token-row">
        <span className="swatch" style={{ background: colour }} />
        <code>{name}</code>
      </span>
    </span>
  )
}

const SAMPLE_COUNTS = {
  migrated: 62,
  sure: 24,
  check: 8,
  byHand: 0,
  none: 4,
  excluded: 0,
  inInstance: 12,
  other: 0,
}

const STEPS: Step[] = [
  {
    id: 'welcome',
    title: 'Update your file to the EDS Beta tokens',
    hero: (
      <div className="intro-hero-tokens">
        {/* A pair the rules make: the same neutral border, another name */}
        <TokenCard
          library="Legacy EDS 2.0"
          name="Border/Medium"
          colour="var(--eds-border-non-interactive-neutral-default)"
        />
        <Icon data={arrow_down} className="intro-hero-arrow" />
        <TokenCard
          library="EDS Beta"
          name="border/non-interactive/neutral/default"
          colour="var(--eds-border-non-interactive-neutral-default)"
        />
      </div>
    ),
    body: (
      <>
        <p>
          The plugin finds the legacy EDS 2.0 variables in your file and
          replaces them with the EDS Beta variables and text styles, layer by
          layer.
        </p>
        <p className="muted">
          In Figma&apos;s library list, the Beta is called EDS Foundation [EDS
          Beta]. Turn it on for the file before you apply anything.
        </p>
      </>
    ),
  },
  {
    id: 'does',
    title: 'What it does',
    hero: (
      <div className="intro-hero-health">
        <span className="intro-hero-figure">62%</span>
        <HealthBar counts={SAMPLE_COUNTS} />
        <span className="intro-hero-badges">
          <Badge tone="success">Migrated</Badge>
          <Badge tone="info">Ready</Badge>
          <Badge tone="warning">Needs check</Badge>
          <Badge tone="danger">No equivalent</Badge>
        </span>
      </div>
    ),
    body: (
      <ul className="intro-list">
        <li>
          Scans a selection, a page or the whole file, and shows how much is
          migrated.
        </li>
        <li>
          Proposes a replacement for every legacy value: <strong>Ready</strong>{' '}
          when the rules are sure, <strong>Needs check</strong> when it depends
          on what the layer does.
        </li>
        <li>
          Applies the Ready changes, sets the new density and colour scheme
          modes, and removes legacy modes nothing needs any more.
        </li>
        <li>
          Turns the legacy Typography component into text with the matching text
          style.
        </li>
        <li>
          Logs every change on the layer, so Revert frame can put it back.
        </li>
      </ul>
    ),
  },
  {
    id: 'does-not',
    title: 'What it does not do',
    hero: (
      <div className="intro-hero-instance">
        <span className="intro-instance-card">
          <Icon data={lock} />
          <span>
            <span className="kind-label">Instance</span> Top bar
          </span>
        </span>
        <span className="intro-hero-caption">
          Changes with its main component
        </span>
      </div>
    ),
    body: (
      <ul className="intro-list">
        <li>
          It never changes anything inside an instance. Migrate the main
          component, and every instance follows.
        </li>
        <li>
          It does not guess. When the rules are unsure, the value waits for your
          review.
        </li>
        <li>
          It leaves values that have no EDS Beta equivalent yet, and reports
          them.
        </li>
        <li>It does not publish libraries or change other files.</li>
        <li>
          It sends no data anywhere. It only loads the Equinor and Inter fonts
          for its window.
        </li>
      </ul>
    ),
  },
  {
    id: 'how',
    title: 'How to use it',
    hero: (
      <ol className="intro-hero-steps">
        {['Scan', 'Look', 'Review', 'Apply'].map((label, index) => (
          <li key={label}>
            <span className="intro-step-number">{index + 1}</span>
            {label}
          </li>
        ))}
      </ol>
    ),
    body: (
      <>
        <ol className="intro-list">
          <li>
            <strong>Scan</strong> the selection, the page or the whole file.
          </li>
          <li>
            <strong>Look</strong> at what changes: Changes lists every legacy
            variable and what it becomes, and Main components shows what to
            migrate first.
          </li>
          <li>
            <strong>Review</strong> the values that need a check, one at a time.
          </li>
          <li>
            <strong>Apply</strong>. Undo with Ctrl or Cmd+Z right after, or
            later with Revert frame.
          </li>
        </ol>
        <p className="muted">
          Start with the page that holds your main components. Their instances
          on the other pages follow.
        </p>
      </>
    ),
  },
  {
    id: 'ready',
    title: 'Ready when you are',
    hero: (
      <div className="intro-hero-ready">
        <Icon data={check_circle_outlined} />
      </div>
    ),
    body: (
      <>
        <p>
          Scan this page to see how much of it already uses the EDS Beta tokens,
          and what the plugin can change.
        </p>
        <p className="muted">
          You can open this introduction again from Settings.
        </p>
      </>
    ),
  },
]

/**
 * The introduction, shown once per person on the first open and from
 * Settings: what the plugin does, what it does not do, and how to use it.
 */
export function Onboarding({ open, onClose }: OnboardingProps) {
  const [index, setIndex] = useState(0)
  const step = STEPS[index]
  const last = index === STEPS.length - 1
  // Focus starts on the way forward, not on Skip, and follows each step.
  const forward = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (open) forward.current?.focus()
  }, [open, index])
  const close = (scanPage: boolean) => {
    onClose(scanPage)
    setIndex(0)
  }
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) close(false)
      }}
      className="intro"
    >
      <div className="intro-hero" data-step={step.id} aria-hidden="true">
        {step.hero}
      </div>
      <div className="intro-body">
        <div className="intro-progress">
          <span className="intro-step-label">
            Step {index + 1} of {STEPS.length}
          </span>
          <span className="intro-segments" aria-hidden="true">
            {STEPS.map((item, position) => (
              <span
                key={item.id}
                className="intro-segment"
                data-done={position <= index ? '' : undefined}
              />
            ))}
          </span>
        </div>
        <Dialog.Title className="intro-title">{step.title}</Dialog.Title>
        <div className="intro-text" aria-live="polite">
          {step.body}
        </div>
      </div>
      <div className="intro-actions">
        {!last && (
          <Button variant="ghost" onClick={() => close(false)}>
            Skip
          </Button>
        )}
        <span className="intro-actions-end">
          {index > 0 && (
            <Button
              variant="secondary"
              onClick={() => setIndex((current) => current - 1)}
            >
              Back
            </Button>
          )}
          {last ? (
            <>
              <Button variant="secondary" onClick={() => close(false)}>
                Close
              </Button>
              <Button ref={forward} onClick={() => close(true)}>
                Scan this page
              </Button>
            </>
          ) : (
            <Button
              ref={forward}
              onClick={() => setIndex((current) => current + 1)}
            >
              Next
            </Button>
          )}
        </span>
      </div>
    </Dialog>
  )
}
