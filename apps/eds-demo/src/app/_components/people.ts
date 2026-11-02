export type Status = 'info' | 'success' | 'warning' | 'danger'

export type Person = {
  id: string
  name: string
  email: string
  position: string
  location: string
  status: Status
  statusLabel: string
}

export const people: Person[] = [
  {
    id: 'EQ-1025',
    name: 'Astrid Bergman',
    email: 'asberg@equinor.com',
    position: 'Senior Engineer',
    location: 'Stavanger',
    status: 'success',
    statusLabel: 'Approved',
  },
  {
    id: 'EQ-2134',
    name: 'Lars Johansen',
    email: 'lajo@equinor.com',
    position: 'Project Manager',
    location: 'Bergen',
    status: 'info',
    statusLabel: 'In review',
  },
  {
    id: 'EQ-3057',
    name: 'Kari Nordmann',
    email: 'kano@equinor.com',
    position: 'HSE Coordinator',
    location: 'Oslo',
    status: 'warning',
    statusLabel: 'Pending',
  },
  {
    id: 'EQ-4109',
    name: 'Johan Sverdrup',
    email: 'josve@equinor.com',
    position: 'Field Operations Lead',
    location: 'Hammerfest',
    status: 'danger',
    statusLabel: 'Rejected',
  },
  {
    id: 'EQ-5320',
    name: 'Ingrid Hansen',
    email: 'inha@equinor.com',
    position: 'Data Analyst',
    location: 'Trondheim',
    status: 'success',
    statusLabel: 'Approved',
  },
  {
    id: 'EQ-6218',
    name: 'Ola Nilsen',
    email: 'olni@equinor.com',
    position: 'Drilling Engineer',
    location: 'Stavanger',
    status: 'info',
    statusLabel: 'In review',
  },
]
