export function AboutOverview() {
  return (
    <section id="overview" className="scroll-mt-8">
      <h2 className="mb-4 text-2xl font-bold">Overview</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          The <abbr title="Equinor Design System">EDS</abbr> Colour Palette
          Generator creates consistent, accessible colour scales for design
          systems. It uses a Gaussian (bell curve) distribution to maintain
          visual harmony across different lightness levels.
        </p>
        <p>
          The tool works in the{' '}
          <abbr title="Oklab Lightness Chroma Hue">OKLCH</abbr> colour space — a
          perceptually uniform model where equal numerical changes produce equal
          perceived differences. This makes it ideal for programmatic colour
          generation.
        </p>
      </div>
    </section>
  )
}
