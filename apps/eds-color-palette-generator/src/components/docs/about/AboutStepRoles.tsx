import { PALETTE_STEPS } from '@/config/config'

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
          The values do not run in one straight line. In dark mode the ladder
          dips at steps 4 and 5, because a strictly increasing ramp could not
          give every role on those steps the contrast it needs. Steps 14 and 15
          run in the opposite direction to steps 1 to 13: step 15 is both the
          text on emphasis fills and <code>background.surface</code>, which
          makes the panel surface lighter than the canvas (step 1) in light mode
          and darker in dark mode.
        </p>
        <p>
          Each step exists for the semantic tokens that point at it. The table
          lists them as Tokens Studio names them, with <code>&lt;tone&gt;</code>{' '}
          standing for accent, neutral, info, success, warning or danger. The
          muted fills sit at steps 1 to 3, the emphasis fills at 9 to 11 and the
          non-interactive borders at 4, 7 and 9. Steps 6 and 14 have no semantic
          token in Tokens Studio today.
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
