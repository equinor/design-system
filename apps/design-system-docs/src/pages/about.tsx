import Layout from '@theme/Layout'
import Heading from '@theme/Heading'
import Link from '@docusaurus/Link'

import type { JSX, ReactNode } from 'react'

import styles from './about.module.css'

type TeamMemberProps = {
  image: string
  name: string
  role: string
}

const TeamMember = ({ image, name, role }: TeamMemberProps) => (
  <div className={styles.teamCard}>
    <img src={image} alt={name} className={styles.teamCardImage} />
    <p className={styles.teamCardName}>{name}</p>
    <p className={styles.teamCardRole}>{role}</p>
  </div>
)

const TEAM: TeamMemberProps[] = [
  {
    image: '/team-images/lavinia.jpg',
    name: 'Lavinia Chrystal',
    role: 'Product Owner / UX Designer',
  },
  {
    image: '/team-images/victor.jpg',
    name: 'Victor Nystad',
    role: 'Design Lead / Tech Lead / Design Engineer',
  },
  {
    image: '/team-images/alexandra.png',
    name: 'Alexandra Louviers',
    role: 'UI / UX Designer',
  },
  {
    image: '/team-images/camilla.jpg',
    name: 'Camilla Knutsen',
    role: 'Frontend Developer',
  },
  {
    image: '/team-images/chibuzor.jpg',
    name: 'Chibuzor Nwemambu',
    role: 'Frontend Developer',
  },
  {
    image: '/team-images/edvard.png',
    name: 'Edvard Pires Bjørgen',
    role: 'UI / UX Designer',
  },
  {
    image: '/team-images/frida.jpg',
    name: 'Frida Erdal',
    role: 'Frontend Developer',
  },
  {
    image: '/team-images/hjalmar.jpg',
    name: 'Hjalmar Otto Fjøsne',
    role: 'Developer / DevOps',
  },
  {
    image: '/team-images/elsa.jpeg',
    name: 'Elsa Mäyrä Irgens',
    role: 'Team Coordinator',
  },
]

function HeroSection(): ReactNode {
  return (
    <section className={styles.hero}>
      <div className="container">
        <Heading as="h1" className={styles.heroTitle}>
          About EDS
        </Heading>
        <p className={styles.heroBody}>
          <strong>Equinor Design System</strong> is Equinor&rsquo;s official
          design system. We provide shared design tokens, UI components, and
          guidelines so teams can build consistent, accessible digital products
          without starting from scratch.
        </p>
        <p className={styles.heroBody}>
          We support the Equinor community through documentation, training, and
          collaboration. Your feedback helps us continuously improve EDS for
          everyone.
        </p>
      </div>
    </section>
  )
}

function TeamSection(): ReactNode {
  return (
    <section className={styles.team}>
      <div className="container">
        <Heading as="h2" className={styles.sectionHeading}>
          The Team
        </Heading>
        <p className={styles.sectionSubtitle}>
          We&rsquo;re a diverse team combining design, development,
          accessibility, and user experience expertise to maintain and evolve
          EDS. Working closely with Equinor&rsquo;s brand team, we ensure every
          component aligns with corporate identity.
        </p>
        <p className={styles.motto}>
          From ideas to interfaces — we connect the dots.
        </p>
        <div className={styles.teamGrid}>
          {TEAM.map((member) => (
            <TeamMember key={member.name} {...member} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ContactSection(): ReactNode {
  return (
    <section className={styles.contact}>
      <div className="container">
        <Heading as="h2" className={styles.sectionHeading}>
          Contact us
        </Heading>
        <p className={styles.sectionSubtitle}>
          Visit our Support page for office hours, community channels, and
          direct contact information.
        </p>
        <Link
          to="https://equinor.slack.com/channels/eds-design-system"
          className={styles.contactCta}
        >
          Reach us on Slack
        </Link>
      </div>
    </section>
  )
}

export default function About(): JSX.Element {
  return (
    <Layout
      title="About EDS"
      description="Meet the team behind Equinor Design System"
    >
      <main>
        <HeroSection />
        <TeamSection />
        <ContactSection />
      </main>
    </Layout>
  )
}
