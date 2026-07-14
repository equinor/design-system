import type { TeamMember } from '../components/TeamCard'

/** Single source of truth for the EDS team roster (consumed by /about and team.mdx). */
export const teamMembers: TeamMember[] = [
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
