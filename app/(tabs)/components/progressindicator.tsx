import {
    circularProgress,
    dotProgress,
    linearProgress,
} from "@/codeSnippets/progressindicator";
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
        <ScrollView style={{ flex: 1 }}>
            <View style={{ padding: 16 }}>
                <Typography variant="h5">Progress</Typography>
                <Spacer amount="small" />

                <Typography variant="p">
                    Progress indicators show that something is loading or
                    processing. Use circular or linear variants depending on the
                    context and available space.
                </Typography>
                <Spacer amount="large" />

                <Typography variant="h6">Circular Progress</Typography>
                <Spacer amount="small" />
                <Typography variant="p">Indeterminate (no value)</Typography>
                <Spacer amount="small" />
                <View style={{ flexDirection: "row", gap: 16 }}>
                    <CircularProgress size={48} color="primary" />
                    <CircularProgress size={48} color="neutral" />
                </View>
                <Spacer amount="large" />
                <Typography variant="p">Determinate (with value)</Typography>
                <Spacer amount="small" />
                <View style={{ flexDirection: "row", gap: 16 }}>
                    <CircularProgress size={48} color="primary" value={0.25} />
                    <CircularProgress size={48} color="primary" value={0.5} />
                    <CircularProgress size={48} color="primary" value={0.75} />
                </View>
                <ViewCode title="Circular Progress" code={circularProgress} />
                <Spacer amount="large" />

                <Typography variant="h5">Dot Progress</Typography>
                <Spacer amount="small" />
                <DotProgress size={48} color="primary" />
                <ViewCode title="Dot Progress" code={dotProgress} />
                <Spacer amount="large" />
                <Typography variant="h5">Linear Progress</Typography>
                <Spacer amount="small" />
                <Typography variant="p">Indeterminate</Typography>
                <Spacer amount="small" />
                <LinearProgress />
                <Spacer amount="large" />
                <Typography variant="p">Determinate</Typography>
                <Spacer amount="small" />
                <LinearProgress value={0.3} />
                <Spacer amount="small" />
                <LinearProgress value={0.6} />
                <Spacer amount="small" />
                <LinearProgress value={0.9} />
                <ViewCode title="Linear Progress" code={linearProgress} />
            </View>

            <CodeSnippetDialog />
        </ScrollView>
    );
}
