import Link from 'next/link'

export function AboutTokensStudio() {
  return (
    <section id="proposing-a-change" className="scroll-mt-8">
      <h2 className="mb-4 text-header-xl font-medium">
        Proposing a change to Tokens Studio
      </h2>
      <div className="space-y-4">
        <p>
          The{' '}
          <Link href="/" className="text-link underline hover:text-link-hover">
            Theme Builder
          </Link>{' '}
          starts with the seven Tokens Studio anchors. A palette stands for a
          Tokens Studio hue when it has the hue&apos;s name, for example Moss
          Green. That name is how the semantic tokens and component previews
          pick up your palette instead of the default, and how the download
          knows which anchor you changed. A palette with a new name is treated
          as a new hue.
        </p>
        <ol className="space-y-2 pl-5 list-decimal">
          <li>
            Change an anchor, or add a palette, on the Colour system tab. Every
            semantic token and the contrast of each text role update as you
            edit, and the Examples tab shows them on components. Check both
            light and dark mode in settings, because each mode has its own
            lightness values.
          </li>
          <li>
            Select Config and choose Tokens Studio anchors. The dialog compares
            each palette with Tokens Studio and marks it as changed, a new hue,
            the same as Tokens Studio, or left out because it has several
            anchors.
          </li>
          <li>
            Download the file. It holds only the changed and new anchors, in the
            shape of the Tokens Studio set <code>input/palette</code>, with
            OKLCH values written the way Tokens Studio writes them.
          </li>
          <li>
            The change takes effect when it is made in Tokens Studio. Tokens
            Studio then generates the 15 steps from the new anchor, and the next
            pull into <code>packages/eds-tokens</code> brings it to{' '}
            <code>@equinor/eds-tokens</code> and to this tool.
          </li>
        </ol>
        <p>
          To keep your work without proposing it, use Share, which copies a link
          with your palettes in it, or Config and Palettes file, which downloads
          the palettes as a file. Config can also import a palettes file, and
          palette configs from the original generator work too.
        </p>
      </div>
    </section>
  )
}
