import { PALETTE_STEPS } from '@/config/config'

/** `[4, 5]` → "4 and 5", `[1, 2, 3]` → "1, 2 and 3" */
function stepList(steps: number[]): string {
  return steps.length < 2
    ? steps.join('')
    : `${steps.slice(0, -1).join(', ')} and ${steps[steps.length - 1]}`
}

// Steps 1 to 13 form the ladder; 14 and 15 run the other way (ADR 0016 D3).
// A dark step dips when it is darker than a step before it in the ladder.
const LADDER = PALETTE_STEPS.slice(0, 13)
const DARK_DIPS = LADDER.filter((step, i) =>
  LADDER.slice(0, i).some((earlier) => earlier.darkValue > step.darkValue),
).map((step) => step.step)

const UNUSED_STEPS = PALETTE_STEPS.filter(
  (step) => step.roles.length === 0,
).map((step) => step.step)

export function AboutStepRoles() {
  return (
    <section id="steps" className="scroll-mt-8">
      <h2 className="mb-4 text-header-xl font-medium">The 15 steps</h2>
      <div className="mb-6 space-y-4">
        <p>
          The lightness of each step is typed by hand in Tokens Studio, 15
          values for light mode and 15 for dark mode, and ADR 0016 (D3) records
          that this is deliberate. When the scale was extended to cover hover,
          pressed, selected and the muted and emphasis ladders, generated
          lightness values did not give usable state ladders, and inserting a
          step into a generated scale shifted and renamed every step after it.
          So the 15 values are picked to make the ladders work, and everything
          after them, chroma and hue, is generated.
        </p>
        <p>
          The values do not run in one straight line.{' '}
          {DARK_DIPS.length > 0 && (
            <>
              In dark mode the ladder dips at{' '}
              {DARK_DIPS.length > 1 ? 'steps' : 'step'} {stepList(DARK_DIPS)},
              because a strictly increasing ramp could not give every role on
              those steps the contrast it needs.{' '}
            </>
          )}
          Steps 14 and 15 run in the opposite direction to steps 1 to 13: step
          15 is both the text on emphasis fills and{' '}
          <code>background.surface</code>, which makes the panel surface lighter
          than the canvas (step 1) in light mode and darker in dark mode.
        </p>
        <p>
          Each step exists for the semantic tokens that point at it. The table
          lists them as Tokens Studio names them, with <code>&lt;tone&gt;</code>{' '}
          standing for accent, neutral, info, success, warning or danger. The
          muted fills sit at steps 1 to 3, the emphasis fills at 9 to 11 and the
          non-interactive borders at 4, 7 and 9.
          {UNUSED_STEPS.length > 0 &&
            ` ${UNUSED_STEPS.length > 1 ? 'Steps' : 'Step'} ${stepList(UNUSED_STEPS)} ${UNUSED_STEPS.length > 1 ? 'have' : 'has'} no semantic token in Tokens Studio today.`}
        </p>
      </div>

      <div className="overflow-x-auto rounded border border-muted bg-surface">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">
            The 15 steps with their lightness and Tokens Studio roles
          </caption>
          <thead>
            <tr className="border-b border-muted text-left">
              <th scope="col" className="px-4 py-2 font-medium">
                Step
              </th>
              <th scope="col" className="px-4 py-2 font-medium">
                Light L
              </th>
              <th scope="col" className="px-4 py-2 font-medium">
                Dark L
              </th>
              <th scope="col" className="px-4 py-2 font-medium">
                Tokens Studio roles
              </th>
            </tr>
          </thead>
          <tbody>
            {PALETTE_STEPS.map((step) => (
              <tr
                key={step.id}
                className="border-b border-muted align-top last:border-b-0"
              >
                <th scope="row" className="px-4 py-2 text-left font-normal">
                  <span className="font-medium">{step.step}</span>{' '}
                  <span className="text-secondary">{step.label}</span>
                </th>
                <td className="px-4 py-2 font-mono tabular-nums">
                  {step.lightValue.toFixed(3)}
                </td>
                <td className="px-4 py-2 font-mono tabular-nums">
                  {step.darkValue.toFixed(3)}
                </td>
                <td className="px-4 py-2">
                  {step.roles.length > 0 ? (
                    <ul className="m-0 list-none space-y-0.5 p-0">
                      {step.roles.map((role) => (
                        <li key={role}>
                          <code className="text-xs">{role}</code>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-tertiary">No semantic role</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
