import React from 'react'
import './team.css'

type TeamProps = {
  image: string
  name: string
  role: string
}

export const Team = ({ image, name, role }: TeamProps) => {
  return (
    <div className="team-card">
      <img src={image} alt={name} />
      <div className="team-card__info">
        <p className="team-card__name">{name}</p>
        <p className="team-card__role">{role}</p>
      </div>
    </div>
  )
}
