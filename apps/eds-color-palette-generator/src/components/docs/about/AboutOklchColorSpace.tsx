export function AboutOklchColorSpace() {
  return (
    <section id="oklch-color-space" className="scroll-mt-8">
      <h2 className="mb-4 text-header-xl font-medium">
        Why OKLCH colour space?
      </h2>
      <div className="p-6 rounded border border-muted bg-surface">
        <p className="mb-4">
          <abbr title="Oklab Lightness Chroma Hue">OKLCH</abbr> is a cylindrical
          representation of the Oklab colour space, designed to be perceptually
          uniform. It has three components:
        </p>
        <dl className="space-y-4">
          <div>
            <dt className="font-medium">Lightness (L)</dt>
            <dd className="ml-4 text-sm text-secondary">
              Ranges from 0 (black) to 1 (white). Perceptually uniform — 0.5 is
              truly medium lightness.
            </dd>
          </div>
          <div>
            <dt className="font-medium">Chroma (C)</dt>
            <dd className="ml-4 text-sm text-secondary">
              Colour intensity or saturation. 0 is greyscale, higher values are
              more vibrant. Unlike{' '}
              <abbr title="Hue Saturation Lightness">HSL</abbr>, chroma is
              consistent across hues.
            </dd>
          </div>
          <div>
            <dt className="font-medium">Hue (H)</dt>
            <dd className="ml-4 text-sm text-secondary">
              The colour angle (0–360 degrees). Represents the basic colour
              quality (red, green, blue, etc.).
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-sm text-secondary">
          By adjusting lightness and chroma independently while keeping hue
          constant, we create colour scales that look natural and maintain
          consistent relationships.
        </p>
      </div>
    </section>
  )
}
