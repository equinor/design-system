import {
    circularProgress,
    dotProgress,
    linearProgress,
} from "@/codeSnippets/progressindicator";
import { Section } from "@/components/Section";
import { useCodeSnippet } from "@/hooks/useCodeSnippet";
import {
    CircularProgress,
    DotProgress,
    LinearProgress,
    Spacer,
    Typography,
} from "@equinor/eds-mobile-components";
import { ScrollView, View } from "react-native";

export default function ProgressIndicatorScreen() {
    const { ViewCode, CodeSnippetDialog } = useCodeSnippet();

    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            <Section>
                <Typography>
                    Progress indicators show that something is loading or
                    processing. Use circular or linear variants depending on the
                    context and available space.
                </Typography>
            </Section>
            <Section title="Circular Progress">
                <Typography variant="body.md">Indeterminate (no value)</Typography>
                <View style={{ flexDirection: "row", gap: 16 }}>
                    <CircularProgress size={48} color="primary" />
                    <CircularProgress size={48} color="neutral" />
                </View>
                <Spacer amount="medium" />
                <Typography variant="body.md">Determinate (with value)</Typography>

                <View style={{ flexDirection: "row", gap: 16 }}>
                    <CircularProgress size={48} color="primary" value={0.25} />
                    <CircularProgress size={48} color="primary" value={0.5} />
                    <CircularProgress size={48} color="primary" value={0.75} />
                </View>
                <ViewCode title="Circular Progress" code={circularProgress} />
            </Section>

            <Section title="Dot Progress">
                <DotProgress size={48} color="primary" />
                <ViewCode title="Dot Progress" code={dotProgress} />
            </Section>

            <Section title="Linear Progress">
                <Typography variant="body.md">Indeterminate</Typography>
                <Spacer amount="small" />
                <LinearProgress />
                <Spacer amount="large" />
                <Typography variant="body.md">Determinate</Typography>
                <Spacer amount="small" />
                <LinearProgress value={0.3} />
                <Spacer amount="small" />
                <LinearProgress value={0.6} />
                <Spacer amount="small" />
                <LinearProgress value={0.9} />
                <ViewCode title="Linear Progress" code={linearProgress} />
            </Section>

            <CodeSnippetDialog />
        </ScrollView>
    );
}
