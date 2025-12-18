export const basicProgress = `import { Progress } from "@equinor/eds-mobile-components";

<Progress>
  <Progress.Item
    title="Success"
    description="Define project requirements"
    status="success"
  />
  <Progress.Item
    title="In progress"
    description="Create mockups and prototypes"
    status="inProgress"
  />
  <Progress.Item
    title="Error"
    description="Build the application"
    status="error"
  />
  <Progress.Item
    title="Waiting"
    description="Quality assurance"
    status="notStarted"
  />
</Progress>`;

export const progressWithTasks = `import { Progress } from "@equinor/eds-mobile-components";

<Progress>
  <Progress.Item
    title="Data Processing"
    tasks={[
      { title: "Load data", status: "success" },
      { title: "Validate data", status: "success" },
      { title: "Transform data", status: "inProgress" },
      { title: "Export data", status: "notStarted" },
    ]}
  />
</Progress>`;
