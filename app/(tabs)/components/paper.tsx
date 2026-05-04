import { basicPaper, paperElevations } from "@/codeSnippets/paper";
import { useCodeSnippet } from "@/hooks/useCodeSnippet";
import {
    Elevation,
    Paper,
    Spacer,
    Typography,
} from "@equinor/eds-mobile-components";
import { ScrollView, StyleSheet, View } from "react-native";

export default function PaperScreen() {
    const { ViewCode, CodeSnippetDialog } = useCodeSnippet();

    const PaperSquare = ({ elevation }: { elevation: Elevation }) => (
        <Paper
            elevation={elevation}
            style={{
                width: 100,
                height: 75,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Typography size="xs">
                {elevation}
            </Typography>
        </Paper>
    );
    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            <View style={styles.section}>
                <Typography>
                    Paper provides a surface for content with configurable
                    elevation. It&apos;s great for grouping related information
                    and creating visual hierarchy.
                </Typography>
            </View>

            <View style={styles.section}>
                <Typography.Header size="lg">Basic Paper</Typography.Header>

                <Paper elevation="raised" style={styles.paper}>
                    <Typography>
                        This is a Paper component. It provides elevation and a
                        card-like appearance.
                    </Typography>
                </Paper>

                <ViewCode title="Basic Paper" code={basicPaper} />
            </View>

            <View style={styles.section}>
                <Typography.Header size="lg">Paper with Content</Typography.Header>

                <Paper elevation="raised" style={styles.paper}>
                    <Typography weight="bolder">
                        Card Title
                    </Typography>
                    <Typography style={styles.cardText}>
                        Paper components are great for grouping related content
                        together. They provide visual hierarchy and help
                        organize information.
                    </Typography>
                </Paper>

                <Spacer amount="small" />
                <Typography.Header size="lg">
                    {" "}
                    Paper with different elevations
                </Typography.Header>
                <View
                    style={{
                        gap: 25,
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        padding: 10,
                    }}
                >
                    <PaperSquare elevation="none" />
                    <PaperSquare elevation="raised" />
                    <PaperSquare elevation="overlay" />
                    <PaperSquare elevation="sticky" />
                    <PaperSquare elevation="temporaryNav" />
                    <PaperSquare elevation="aboveScrim" />
                </View>

                <ViewCode title="Paper Elevations" code={paperElevations} />
            </View>

            <CodeSnippetDialog />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    section: {
        padding: 16,
        gap: 16,
    },
    paper: {
        padding: 16,
    },
    cardText: {
        marginTop: 8,
    },
});
