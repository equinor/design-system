// Define data structure for table
export type ChipVariant = "info" | "success" | "warning" | "danger";

export type TableData = {
  id: string;
  selected: boolean;
  person: {
    name: string;
    email: string;
  };
  position: string;
  location: string;
  status: {
    type: ChipVariant;
    label: string;
  };
  active?: boolean;
};

export const tableData: TableData[] = [
  {
    id: "EQ-1025",
    selected: false,
    person: {
      name: "Astrid Bergman",
      email: "asberg@equinor.com",
    },
    position: "Senior Engineer",
    location: "Stavanger",
    status: {
      type: "success",
      label: "Approved",
    },
  },
  {
    id: "EQ-2134",
    selected: true,
    person: {
      name: "Lars Johansen",
      email: "lajo@equinor.com",
    },
    position: "Project Manager",
    location: "Bergen",
    status: {
      type: "info",
      label: "In Review",
    },
    active: true,
  },
  {
    id: "EQ-3057",
    selected: false,
    person: {
      name: "Kari Nordmann",
      email: "kano@equinor.com",
    },
    position: "HSE Coordinator",
    location: "Oslo",
    status: {
      type: "warning",
      label: "Pending",
    },
  },
  {
    id: "EQ-4109",
    selected: false,
    person: {
      name: "Johan Sverdrup",
      email: "josve@equinor.com",
    },
    position: "Field Operations Lead",
    location: "Hammerfest",
    status: {
      type: "danger",
      label: "Rejected",
    },
  },
  {
    id: "EQ-5320",
    selected: false,
    person: {
      name: "Ingrid Olsen",
      email: "ingols@equinor.com",
    },
    position: "Environmental Specialist",
    location: "Trondheim",
    status: {
      type: "info",
      label: "In Progress",
    },
  },
  {
    id: "EQ-6437",
    selected: false,
    person: {
      name: "Magnus Eriksen",
      email: "mageri@equinor.com",
    },
    position: "Drilling Engineer",
    location: "Stavanger",
    status: {
      type: "success",
      label: "Completed",
    },
  },
  {
    id: "EQ-7892",
    selected: false,
    person: {
      name: "Silje Hansen",
      email: "silhan@equinor.com",
    },
    position: "Process Engineer",
    location: "Bergen",
    status: {
      type: "warning",
      label: "On Hold",
    },
  },
];
