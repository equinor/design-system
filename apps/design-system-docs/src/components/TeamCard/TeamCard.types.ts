export type TeamMember = {
  /** Image path relative to the site (resolved through `useBaseUrl`). */
  image: string
  name: string
  role: string
}

export type TeamCardProps = TeamMember

export type TeamCardGridProps = {
  members: TeamMember[]
}
