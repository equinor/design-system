import type { ReactNode } from 'react'
import clsx from 'clsx'
import Heading from '@theme/Heading'
import styles from './styles.module.css'

type FeatureItem = {
  title: string
  Svg: React.ComponentType<React.ComponentProps<'svg'>>
  description: ReactNode
}

import Designer from '../../../static/img/illustrations/designer_illu.svg'
import Devices from '../../../static/img/illustrations/devices_illu.svg'
import Puzzle from '../../../static/img/illustrations/puzzle_illu.svg'

const FeatureList: FeatureItem[] = [
  {
    title: 'Resources',
    Svg: Puzzle,
    description: <> Comprehensive resources like React and Figma components, tokens, icons and colour palettes.</>,
  },
  {
    title: 'Documentation',
    Svg: Devices,
    description: (
      <>Guidelines, patterns, and principles for consistent builds.</>
    ),
  },
  {
    title: 'Living',
    Svg: Designer,
    description: <>Evolving with collaboration and community contributions.</>,
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
        <div className={styles.featuresRow}>
          {FeatureList.map((props) => (
            <Feature key={props.title} {...props} />
          ))}
        </div>
      </div>
    </section>
  )
}
