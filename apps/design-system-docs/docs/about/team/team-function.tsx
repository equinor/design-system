import './team.css'

export default function Team({ image, name, role }) {
  return (
    <div>
      <img src={image} className="circle" alt={name} />
      <p className="text--center padding-horiz--md">{name}</p>
      <p className="text--center padding-horiz--md">{role}</p>
    </div>
  )
}
