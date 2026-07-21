export function AboutLearnMore() {
  return (
    <section id="learn-more" className="pb-12 scroll-mt-8">
      <h2 className="mb-4 text-2xl font-bold">Learn more</h2>
      <div className="p-6 rounded-lg bg-surface">
        <ul className="space-y-3 text-sm">
          <li>
            <a
              href="https://developer.chrome.com/docs/css-ui/high-definition-css-color-guide"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              High definition CSS color guide
            </a>
          </li>
          <li>
            <a
              href="https://lea.verou.me/blog/2020/04/lch-colors-in-css-what-why-and-how/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              LCH colors in CSS: what, why, and how?
            </a>
          </li>
          <li>
            <a
              href="https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              OKLCH in CSS: why we moved from{' '}
              <abbr title="Red Green Blue">RGB</abbr> and{' '}
              <abbr title="Hue Saturation Lightness">HSL</abbr>
            </a>
          </li>
          <li>
            <a
              href="https://git.apcacontrast.com/documentation/APCAeasyIntro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              <abbr title="Accessible Perceptual Contrast Algorithm">APCA</abbr>{' '}
              contrast algorithm
            </a>
          </li>
          <li>
            <a
              href="https://www.radix-ui.com/colors"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Radix UI: A gorgeous, accessible color system for user interfaces
            </a>
          </li>
          <li>
            <a
              href="https://www.figma.com/proto/YQNlL2nGozvROuz8G2XnQU/Presentations?node-id=29732-29814&p=f&t=PTYP4InT4YxjKvbq-1&scaling=contain&content-scaling=fixed&page-id=29732%3A29813"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              EDS APCA presentation Global Accessibility Awareness Day 2024
            </a>
          </li>
          <li>
            <a
              href="https://oklch.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              OKLCH color picker and converter
            </a>
          </li>
        </ul>
      </div>
    </section>
  )
}
