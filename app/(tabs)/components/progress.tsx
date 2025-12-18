import { basicProgress, progressWithTasks } from "@/codeSnippets/progress";
import { useCodeSnippet } from "@/hooks/useCodeSnippet";
import { Progress, Typography } from "@equinor/eds-mobile-components";
import { ScrollView, StyleSheet, View } from "react-native";

export default function ProgressScreen() {
    const { ViewCode, CodeSnippetDialog } = useCodeSnippet();

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Typography variant="h5">Progress</Typography>
                <Typography variant="p">
                    Progress tracks multi-step workflows by showing each stage
                    and its current status. It&apos;s helpful when users need to
                    see where they are in a process.
                </Typography>
            </View>

            <View style={styles.section}>
                <Typography variant="h6">Linear Progress</Typography>

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
            </View>

            <View style={styles.section}>
                <Typography variant="h6">Progress with Tasks</Typography>
                <Typography style={styles.description}>
                    Progress items can track multiple subtasks
                </Typography>

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

                <ViewCode
                    title="Progress with Tasks"
                    code={progressWithTasks}
                />
            </View>

            <CodeSnippetDialog />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    section: {
        marginBottom: 32,
    },
    description: {
        marginBottom: 16,
        opacity: 0.7,
    },
    expandedContent: {
        padding: 12,
        opacity: 0.8,
    },
});
