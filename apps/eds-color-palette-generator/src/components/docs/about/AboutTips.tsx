const TIPS = [
  {
    title: 'Give the anchor enough chroma',
    text: 'The Gaussian curve can only lower the anchor’s chroma, never raise it, so the anchor’s chroma is the most any step can have. An anchor that looks muted gives a scale where every step is muted.',
  },
  {
    title: 'Look at the generated steps',
    text: 'The anchor’s lightness is not used, so the colour you pick may not appear anywhere in the scale. Look at the steps that matter for the hue, usually the emphasis fills at steps 9 to 11 and the muted fills at steps 1 to 3.',
  },
  {
    title: 'Check both modes',
    text: 'Light and dark mode have different lightness values and a different curve, so an anchor that works in one can fail a contrast requirement in the other. Switch mode in settings and look at the contrast results again.',
  },
  {
    title: 'Keep the hue’s name',
    text: 'A palette named after a Tokens Studio hue, such as Moss Green, replaces that hue in the semantic tokens, the previews and the download. Renaming it makes it a new hue.',
  },
]

export function AboutTips() {
  return (
    <section id="tips" className="scroll-mt-8">
      <h2 className="mb-4 text-header-xl font-medium">Tips</h2>
      <ul className="m-0 list-none space-y-4 rounded border border-muted bg-surface p-6">
        {TIPS.map((tip) => (
          <li key={tip.title}>
            <p className="m-0 font-medium">{tip.title}</p>
            <p className="m-0 text-sm text-secondary">{tip.text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
