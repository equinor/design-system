import MDXComponents from '@theme-original/MDXComponents'
import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

import { Hero } from '@site/src/components/Hero'
import { SectionHeading } from '@site/src/components/SectionHeading'
import { IconCard, IconCardGrid } from '@site/src/components/IconCard'
import { CtaSection } from '@site/src/components/CtaSection'
import { Icon } from '@site/src/components/Icon'
import { StorybookEmbed } from '@site/src/components/StorybookEmbed'
import { DocsLanding } from '@site/src/components/DocsLanding'

// Register shared components globally so MDX docs can use them without a
// per-file import. Keeps the layout/card system identical between the React
// pages (src/pages) and the MDX docs.
export default {
  ...MDXComponents,
  Tabs,
  TabItem,
  Hero,
  SectionHeading,
  IconCard,
  IconCardGrid,
  CtaSection,
  Icon,
  StorybookEmbed,
  DocsLanding,
}
