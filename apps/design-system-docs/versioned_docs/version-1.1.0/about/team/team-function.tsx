import React from 'react'
import './team.css'

type TeamProps = {
  image: string
  name: string
  role: string
}

export const Team = ({ image, name, role }: TeamProps) => {
  return (
    <div>
      <img src={image} className="circle" alt={name} />
      <p className="text--center padding-horiz--md">{name}</p>
      <p className="text--center padding-horiz--md">{role}</p>
    </div>
  )
}
