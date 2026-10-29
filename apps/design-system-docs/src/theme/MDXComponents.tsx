import MDXComponents from '@theme-original/MDXComponents'

import { Hero } from '@site/src/components/Hero'
import { SectionHeading } from '@site/src/components/SectionHeading'
import { IconCard, IconCardGrid } from '@site/src/components/IconCard'
import { CtaSection } from '@site/src/components/CtaSection'
import { Icon } from '@site/src/components/Icon'
import { StorybookEmbed } from '@site/src/components/StorybookEmbed'
import { StoryCanvas } from '@site/src/components/StoryCanvas'
import { BetaNotice } from '@site/src/components/BetaNotice'
import { DocsLanding } from '@site/src/components/DocsLanding'
import { DocsSection } from '@site/src/components/DocsSection'
import { GalleryCard, GalleryGrid } from '@site/src/components/GalleryCard'
import { TooltipMock } from '@site/src/components/TooltipMock'
import { Prerequisites } from '@site/src/components/Prerequisites'
import { TypeSpecimen } from '@site/src/components/TypeSpecimen'
import { StatusChip } from '@site/src/components/StatusChip'

// Register shared components globally so MDX docs can use them without a
// per-file import. Keeps the layout/card system identical between the React
// pages (src/pages) and the MDX docs.
export default {
  ...MDXComponents,
  Hero,
  SectionHeading,
  IconCard,
  IconCardGrid,
  CtaSection,
  Icon,
  StorybookEmbed,
  StoryCanvas,
  BetaNotice,
  DocsLanding,
  DocsSection,
  GalleryCard,
  GalleryGrid,
  TooltipMock,
  Prerequisites,
  TypeSpecimen,
  StatusChip,
}
