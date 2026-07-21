export function AboutHowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-8">
      <h2 className="mb-6 text-2xl font-bold">How it works</h2>
      <div className="space-y-6">
        <div className="p-6 rounded-lg bg-surface">
          <h3 className="mb-3 text-xl font-semibold">
            1. Define lightness values
          </h3>
          <p className="mb-4 text-neutral-subtle">
            Each colour scale step has a predefined lightness value chosen to
            meet contrast requirements:
          </p>
          <ul className="space-y-2 text-sm list-disc list-inside">
            <li>
              <strong>Background colours:</strong> High lightness in light mode
              (0.97–0.999), low in dark mode (0.15–0.25)
            </li>
            <li>
              <strong>Border colours:</strong> Mid-range values for subtle to
              strong emphasis
            </li>
            <li>
              <strong>Fill colours:</strong> Values optimised for interactive
              elements
            </li>
            <li>
              <strong>Text colours:</strong> Values ensuring{' '}
              <abbr title="Web Content Accessibility Guidelines">WCAG</abbr>{' '}
              AA/AAA compliance
            </li>
          </ul>
          <p className="mt-4 text-sm text-neutral-subtle">
            Lightness values are configured separately for light and dark modes
            to ensure optimal contrast in both.
          </p>
        </div>

        <div className="p-6 rounded-lg bg-surface">
          <h3 className="mb-3 text-xl font-semibold">
            2. Choose your colour approach
          </h3>
          <p className="mb-4 text-neutral-subtle">
            You can define colours in two ways:
          </p>
          <div className="space-y-3 text-sm">
            <div className="p-4 border rounded border-neutral-subtle">
              <h4 className="mb-2 font-semibold">Single value (traditional)</h4>
              <p className="text-neutral-subtle">
                Provide one base colour, and the generator creates all steps
                with the same hue, varying only lightness and chroma using
                Gaussian distribution.
              </p>
            </div>
            <div className="p-4 border rounded border-neutral-subtle">
              <h4 className="mb-2 font-semibold">
                Multiple anchors (interpolation)
              </h4>
              <p className="text-neutral-subtle">
                Define colours at specific steps (e.g., step 6 and step 9), and
                the generator smoothly interpolates between them in{' '}
                <abbr title="Oklab Lightness Chroma Hue">OKLCH</abbr> space,
                allowing hue to shift naturally while still applying Gaussian
                chroma distribution.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-lg bg-surface">
          <h3 className="mb-3 text-xl font-semibold">
            3. Apply Gaussian distribution to chroma
          </h3>
          <p className="mb-4 text-neutral-subtle">
            While lightness is fixed, chroma (colour intensity) varies using a
            Gaussian function. This creates natural colour progression — colours
            are most vibrant at a specific lightness level (the mean) and
            gradually become more muted as you move away from it.
          </p>
          <div className="p-4 mb-4 font-mono text-sm border rounded border-neutral-subtle">
            gaussian(x, mean, stdDev) = exp((-25 / stdDev) × (mean - x)²)
          </div>
          <p className="text-sm text-neutral-subtle">
            The function outputs a multiplier (0–1) applied to the base
            colour&apos;s chroma at each step.
          </p>
        </div>

        <div className="p-6 rounded-lg bg-surface">
          <h3 className="mb-3 text-xl font-semibold">4. Generate colour scale</h3>
          <p className="mb-4 text-neutral-subtle">For each step:</p>
          <ol className="space-y-2 text-sm list-decimal list-inside">
            <li>Convert the base colour(s) to OKLCH colour space</li>
            <li>Set the lightness to the predefined value for that step</li>
            <li>
              If using multiple anchors, interpolate between them to get the base
              colour for this step
            </li>
            <li>
              Calculate the chroma multiplier using the Gaussian function with
              the step&apos;s lightness
            </li>
            <li>
              Apply the multiplier to the base colour&apos;s chroma: new_chroma =
              base_chroma × multiplier
            </li>
            <li>
              For single value: Keep the hue unchanged. For multiple anchors: Hue
              shifts naturally through interpolation
            </li>
          </ol>
          <p className="mt-4 text-sm text-neutral-subtle">
            This ensures colours maintain visual harmony while adapting intensity
            to suit different lightness levels.
          </p>
        </div>

        <div className="p-6 rounded-lg bg-surface">
          <h3 className="mb-3 text-xl font-semibold">
            5. Multiple colour anchors (interpolation)
          </h3>
          <p className="mb-4 text-neutral-subtle">
            For more control, you can define multiple colour anchors at specific
            steps. The generator will interpolate between them in{' '}
            <abbr title="Oklab Lightness Chroma Hue">OKLCH</abbr> space.
          </p>

          {/* Single Value Example */}
          <div className="mb-6">
            <h4 className="mb-3 text-sm font-semibold">
              Single value (traditional approach)
            </h4>
            <div className="p-4 mb-2 border rounded border-neutral-subtle bg-canvas">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-8 h-8 border rounded border-neutral-subtle"
                  style={{
                    backgroundColor: 'oklch(0.4973 0.084851 204.553)',
                  }}
                />
                <span className="text-sm">
                  <span className="font-mono text-xs">
                    oklch(0.4973 0.084851 204.553)
                  </span>{' '}
                  <span className="text-neutral-subtle">(Moss Green)</span>
                </span>
              </div>
              <p className="mb-3 text-xs text-neutral-subtle">
                The base colour is used for all steps with Gaussian chroma
                distribution applied at each lightness level:
              </p>
              <div className="flex gap-1">
                <div
                  className="flex-1 h-12 border rounded-l border-neutral-subtle"
                  style={{ backgroundColor: '#eaf8fa' }}
                  title="Step 1"
                />
                <div
                  className="flex-1 h-12 border-t border-b border-neutral-subtle"
                  style={{ backgroundColor: '#f6ffff' }}
                  title="Step 2"
                />
                <div
                  className="flex-1 h-12 border-t border-b border-neutral-subtle"
                  style={{ backgroundColor: '#cfe7e9' }}
                  title="Step 3"
                />
                <div
                  className="flex-1 h-12 border-t border-b border-neutral-subtle"
                  style={{ backgroundColor: '#bbdbdf' }}
                  title="Step 4"
                />
                <div
                  className="flex-1 h-12 border-t border-b border-neutral-subtle"
                  style={{ backgroundColor: '#a2cdd2' }}
                  title="Step 5"
                />
                <div
                  className="flex-1 h-12 border-t border-b border-neutral-subtle"
                  style={{ backgroundColor: '#bbdbdf' }}
                  title="Step 6"
                />
                <div
                  className="flex-1 h-12 border-t border-b border-neutral-subtle"
                  style={{ backgroundColor: '#7cbac1' }}
                  title="Step 7"
                />
                <div
                  className="flex-1 h-12 border-t border-b border-neutral-subtle"
                  style={{ backgroundColor: '#21767e' }}
                  title="Step 8"
                />
                <div
                  className="flex-1 h-12 border-t border-b border-neutral-subtle"
                  style={{ backgroundColor: '#206f77' }}
                  title="Step 9"
                />
                <div
                  className="flex-1 h-12 border-t border-b border-neutral-subtle"
                  style={{ backgroundColor: '#205c62' }}
                  title="Step 10"
                />
                <div
                  className="flex-1 h-12 border-t border-b border-neutral-subtle"
                  style={{ backgroundColor: '#20565c' }}
                  title="Step 11"
                />
                <div
                  className="flex-1 h-12 border-t border-b border-neutral-subtle"
                  style={{ backgroundColor: '#1f6369' }}
                  title="Step 12"
                />
                <div
                  className="flex-1 h-12 border-t border-b border-neutral-subtle"
                  style={{ backgroundColor: '#141f20' }}
                  title="Step 13"
                />
                <div
                  className="flex-1 h-12 border-t border-b border-neutral-subtle"
                  style={{ backgroundColor: '#cae4e7' }}
                  title="Step 14"
                />
                <div
                  className="flex-1 h-12 border rounded-r border-neutral-subtle"
                  style={{ backgroundColor: '#ffffff' }}
                  title="Step 15"
                />
              </div>
              <div className="flex justify-between mt-1 text-xs text-neutral-subtle">
                <span>1</span>
                <span>15</span>
              </div>
            </div>
          </div>

          {/* Multiple Anchors Example - Using actual generated values from test snapshots */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">
              Multiple anchors (interpolation approach)
            </h4>
            <div className="p-4 border rounded border-neutral-subtle bg-canvas">
              <div className="flex items-center gap-6 mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 border rounded border-neutral-subtle"
                    style={{
                      backgroundColor: '#c0dbd6',
                    }}
                  />
                  <div className="text-sm">
                    <div className="font-mono text-xs">
                      oklch(0.5915 0.0731 184.63)
                    </div>
                    <div className="text-xs text-neutral-subtle">
                      Anchor at step 6
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 border rounded border-neutral-subtle"
                    style={{
                      backgroundColor: '#206f77',
                    }}
                  />
                  <div className="text-sm">
                    <div className="font-mono text-xs">
                      oklch(0.4973 0.084851 204.553)
                    </div>
                    <div className="text-xs text-neutral-subtle">
                      Anchor at step 9
                    </div>
                  </div>
                </div>
              </div>
              <p className="mb-3 text-xs text-neutral-subtle">
                Colours smoothly interpolate between anchors in OKLCH space, with
                Gaussian chroma distribution applied:
              </p>
              <div className="flex gap-1">
                <div
                  className="flex-1 h-12 border-t border-b border-l rounded-l border-neutral-subtle"
                  style={{ backgroundColor: '#ecf8f6' }}
                  title="Step 1"
                />
                <div
                  className="flex-1 h-12 border-t border-b border-neutral-subtle"
                  style={{ backgroundColor: '#f8ffff' }}
                  title="Step 2"
                />
                <div
                  className="flex-1 h-12 border-t border-b border-neutral-subtle"
                  style={{ backgroundColor: '#d2e6e3' }}
                  title="Step 3"
                />
                <div
                  className="flex-1 h-12 border-t border-b border-neutral-subtle"
                  style={{ backgroundColor: '#c0dbd6' }}
                  title="Step 4"
                />
                <div
                  className="flex-1 h-12 border-t border-b border-neutral-subtle"
                  style={{ backgroundColor: '#a8cdc7' }}
                  title="Step 5"
                />
                <div
                  className="flex-1 h-12 border-[3px] border-blue-500"
                  style={{ backgroundColor: '#c0dbd6' }}
                  title="Step 6 (anchor)"
                />
                <div
                  className="flex-1 h-12 border-t border-b border-neutral-subtle"
                  style={{ backgroundColor: '#83bab7' }}
                  title="Step 7"
                />
                <div
                  className="flex-1 h-12 border-t border-b border-neutral-subtle"
                  style={{ backgroundColor: '#277678' }}
                  title="Step 8"
                />
                <div
                  className="flex-1 h-12 border-[3px] border-blue-500"
                  style={{ backgroundColor: '#206f77' }}
                  title="Step 9 (anchor)"
                />
                <div
                  className="flex-1 h-12 border-t border-b border-neutral-subtle"
                  style={{ backgroundColor: '#205c62' }}
                  title="Step 10"
                />
                <div
                  className="flex-1 h-12 border-t border-b border-neutral-subtle"
                  style={{ backgroundColor: '#20565c' }}
                  title="Step 11"
                />
                <div
                  className="flex-1 h-12 border-t border-b border-neutral-subtle"
                  style={{ backgroundColor: '#1f6369' }}
                  title="Step 12"
                />
                <div
                  className="flex-1 h-12 border-t border-b border-neutral-subtle"
                  style={{ backgroundColor: '#141f20' }}
                  title="Step 13"
                />
                <div
                  className="flex-1 h-12 border-t border-b border-neutral-subtle"
                  style={{ backgroundColor: '#cae4e7' }}
                  title="Step 14"
                />
                <div
                  className="flex-1 h-12 border-t border-b border-r rounded-r border-neutral-subtle"
                  style={{ backgroundColor: '#f7ffff' }}
                  title="Step 15"
                />
              </div>
              <div className="relative flex mt-1 text-xs text-neutral-subtle">
                <span className="absolute left-[37.5%] font-medium">6</span>
                <span className="absolute left-[57.5%] font-medium">9</span>
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm text-neutral-subtle">
            This technique is useful for creating gradient-like scales where you
            want precise control over specific steps while maintaining smooth
            transitions between them. The Gaussian chroma distribution is still
            applied, but hue and lightness can shift naturally between your
            defined anchors.
          </p>
        </div>
      </div>
    </section>
  )
}
