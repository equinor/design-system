import { basicProgress, progressWithTasks } from "@/codeSnippets/progress";
import { Section } from "@/components/Section";
import { useCodeSnippet } from "@/hooks/useCodeSnippet";
import { Progress, Typography } from "@equinor/eds-mobile-components";
import { ScrollView } from "react-native";

export default function ProgressScreen() {
    const { ViewCode, CodeSnippetDialog } = useCodeSnippet();

    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            <Section>
                <Typography>
                    Progress tracks multi-step workflows by showing each stage
                    and its current status. It&apos;s helpful when users need to
                    see where they are in a process.
                </Typography>
            </Section>

            <Section title="Simple progress"></Section>
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
            </Progress>
            <ViewCode title="Basic Progress" code={basicProgress} />

            <Section title="Progress with Tasks">
                <Typography>
                    Progress items can track multiple subtasks
                </Typography>
            </Section>
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
            </Progress>

            <ViewCode title="Progress with Tasks" code={progressWithTasks} />

            <CodeSnippetDialog />
        </ScrollView>
    );
}
