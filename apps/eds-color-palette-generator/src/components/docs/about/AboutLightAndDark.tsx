import Link from 'next/link'
import {
  TONES,
  TS_GAUSSIAN,
  TS_SCALE,
  TS_TONE_HUE,
  hueDisplayName,
} from '@/config/tokensStudio'
import { gaussian } from '@/utils/color'

// Step 9, the emphasis fill, in dark mode: its chroma multiplier with the dark
// curve and, for comparison, with the light curve
const DARK_STEP_9 = TS_SCALE.dark[8]
const darkMultiplier = gaussian(
  DARK_STEP_9,
  TS_GAUSSIAN.dark.mean,
  TS_GAUSSIAN.dark.stdDev,
)
const lightCurveMultiplier = gaussian(
  DARK_STEP_9,
  TS_GAUSSIAN.light.mean,
  TS_GAUSSIAN.light.stdDev,
)

// Tones whose hue differs between the modes (today only neutral)
const SWITCHING_TONES = TONES.filter(
  (tone) => TS_TONE_HUE.light[tone] !== TS_TONE_HUE.dark[tone],
)

export function AboutLightAndDark() {
  return (
    <section id="light-and-dark" className="scroll-mt-8">
      <h2 className="mb-4 text-header-xl font-medium">Light and dark mode</h2>
      <div className="space-y-4">
        <p>
          The anchors are the same in both modes. What changes is the lightness
          of each step, the Gaussian curve and, for some tones, which hue the
          tone uses.
        </p>
        <dl className="m-0 space-y-4 rounded border border-muted bg-surface p-6">
          <div>
            <dt className="font-medium">Lightness</dt>
            <dd className="m-0 text-sm text-secondary">
              Each mode has its own 15 hand-set values, shown in the table under
              The 15 steps. In dark mode the ladder mostly runs the other way,
              so the muted fills are dark and the emphasis fills and text are
              light.
            </dd>
          </div>
          <div>
            <dt className="font-medium">Gaussian curve</dt>
            <dd className="m-0 text-sm text-secondary">
              The mean is {TS_GAUSSIAN.light.mean} in light mode and{' '}
              {TS_GAUSSIAN.dark.mean} in dark mode. With the higher mean, the
              light steps of a dark scale keep more chroma. Step 9 in dark mode
              has L {DARK_STEP_9}, and the dark curve gives it a multiplier of{' '}
              {darkMultiplier.toFixed(2)}, where the light curve would give{' '}
              {lightCurveMultiplier.toFixed(2)}.
            </dd>
          </div>
          <div>
            <dt className="font-medium">Hue per tone</dt>
            <dd className="m-0 text-sm text-secondary">
              {SWITCHING_TONES.length === 0
                ? 'Every tone uses the same hue in both modes.'
                : SWITCHING_TONES.map((tone) => (
                    <span key={tone}>
                      The {tone} tone uses{' '}
                      {hueDisplayName(TS_TONE_HUE.light[tone])} in light mode
                      and {hueDisplayName(TS_TONE_HUE.dark[tone])} in dark
                      mode.{' '}
                    </span>
                  ))}
              {SWITCHING_TONES.length > 0 &&
                'The other tones use the same hue in both modes. Tokens Studio sets this in the scheme/light and scheme/dark sets.'}
            </dd>
          </div>
        </dl>
        <p>
          All of these come from Tokens Studio, so the Theme Builder has no
          settings for them. To try other lightness values or curve settings,
          use the{' '}
          <Link
            href="/old"
            className="text-link underline hover:text-link-hover"
          >
            original generator
          </Link>
          , which still has those controls.
        </p>
      </div>
    </section>
  )
}
