import type { ReactNode } from 'react'
import clsx from 'clsx'
import Heading from '@theme/Heading'
import styles from './styles.module.css'

type FeatureItem = {
  title: string
  Svg: React.ComponentType<React.ComponentProps<'svg'>>
  description: ReactNode
}

import DocusaurusMountain from '@site/static/img/undraw_docusaurus_mountain.svg'
import DocusaurusTree from '@site/static/img/undraw_docusaurus_tree.svg'
import DocusaurusReact from '@site/static/img/undraw_docusaurus_react.svg'

const FeatureList: FeatureItem[] = [
  {
    title: 'Resources',
    Svg: DocusaurusMountain,
    description: (
      <>
        Provides teams with easy-to-use resources, from React & Figma component
        libraries to icons, design tokens, colors, typography and more
      </>
    ),
  },
  {
    title: 'Documentation',
    Svg: DocusaurusReact,
    description: (
      <>Guidelines, principles and how-to&apos;s built on a common language</>
    ),
  },
  {
    title: 'Living',
    Svg: DocusaurusTree,
    description: (
      <>
        EDS is always evolving, invites collaboration and depends on
        contributions
      </>
    ),
  },
  {
    title: 'Supported',
    Svg: DocusaurusMountain,
    description: <>EDS is supported by the EDS core team</>,
  },
]

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col col--3')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  )
}

export function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props) => (
            <Feature key={props.title} {...props} />
          ))}
        </div>
      </div>
    </section>
  )
}
