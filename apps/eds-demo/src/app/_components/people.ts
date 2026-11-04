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
    name: 'Tore Knakkel',
    email: 'tokr@equinor.com',
    position: 'Drilling Engineer',
    location: 'Stavanger',
    status: 'info',
    statusLabel: 'In review',
  },
  {
    id: 'EQ-7041',
    name: 'Siri Lunde',
    email: 'silu@equinor.com',
    position: 'Reservoir Engineer',
    location: 'Bergen',
    status: 'success',
    statusLabel: 'Approved',
  },
  {
    id: 'EQ-7158',
    name: 'Erik Solberg',
    email: 'erso@equinor.com',
    position: 'Maintenance Planner',
    location: 'Kristiansund',
    status: 'warning',
    statusLabel: 'Pending',
  },
  {
    id: 'EQ-7203',
    name: 'Mari Dahl',
    email: 'mada@equinor.com',
    position: 'Geologist',
    location: 'Harstad',
    status: 'success',
    statusLabel: 'Approved',
  },
  {
    id: 'EQ-8016',
    name: 'Kjell Bjarne Bjarnesen',
    email: 'kjbj@equinor.com',
    position: 'Process Engineer',
    location: 'Mongstad',
    status: 'info',
    statusLabel: 'In review',
  },
  {
    id: 'EQ-8124',
    name: 'Andreas Nes Dommer',
    email: 'adommi@equinor.com',
    position: 'Process Operator',
    location: 'Kårstø',
    status: 'success',
    statusLabel: 'Approved',
  },
  {
    id: 'EQ-8377',
    name: 'Sindre Haugen',
    email: 'siha@equinor.com',
    position: 'Subsea Engineer',
    location: 'Florø',
    status: 'success',
    statusLabel: 'Approved',
  },
  {
    id: 'EQ-9052',
    name: 'Svein Bjarne Bjarnesen',
    email: 'svbj@equinor.com',
    position: 'Logistics Coordinator',
    location: 'Stjørdal',
    status: 'warning',
    statusLabel: 'Pending',
  },
  {
    id: 'EQ-9310',
    name: 'Magnus Strand',
    email: 'mast@equinor.com',
    position: 'Automation Engineer',
    location: 'Trondheim',
    status: 'info',
    statusLabel: 'In review',
  },
]
