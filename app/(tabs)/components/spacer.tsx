import { horizontalSpacer, verticalSpacer } from "@/codeSnippets/spacer";
import { Section } from "@/components/Section";
import { useCodeSnippet } from "@/hooks/useCodeSnippet";
import {
    EDSStyleSheet,
    Paper,
    Spacer,
    Typography,
    useStyles,
} from "@equinor/eds-mobile-components";
import { ScrollView, View } from "react-native";

export default function SpacerScreen() {
    const { ViewCode, CodeSnippetDialog } = useCodeSnippet();
    const styles = useStyles(tokenStyles);

    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            <Section>
                <Typography>
                    Spacers add consistent vertical or horizontal spacing
                    between elements — a handy alternative to manual margins
                    that keeps layouts predictable.
                </Typography>
            </Section>
            <Section title="Vertical Spacer">
                <Paper elevation="raised">
                    <View style={styles.verticalPaperContainer}>
                        <Typography>Small</Typography>
                        <View>
                            <View style={styles.horizontalDivider} />
                            <Spacer amount="small" />
                            <View style={styles.horizontalDivider} />
                        </View>
                    </View>
                </Paper>

                <Paper elevation="raised">
                    <View style={styles.verticalPaperContainer}>
                        <Typography>Medium</Typography>
                        <View>
                            <View style={styles.horizontalDivider} />
                            <Spacer amount="medium" />
                            <View style={styles.horizontalDivider} />
                        </View>
                    </View>
                </Paper>

                <Paper elevation="raised">
                    <View style={styles.verticalPaperContainer}>
                        <Typography>Large</Typography>
                        <View>
                            <View style={styles.horizontalDivider} />
                            <Spacer amount="large" />
                            <View style={styles.horizontalDivider} />
                        </View>
                    </View>
                </Paper>
                <ViewCode title="Vertical Spacer" code={verticalSpacer} />
            </Section>

            <Section title="Horizontal Spacer">
                <View style={styles.horizontalPaperRow}>
                    <Paper
                        elevation="raised"
                        style={styles.horizontalPaperContainer}
                    >
                        <View>
                            <View style={styles.verticalDivider} />
                            <Spacer.Horizontal amount="small" />
                            <View style={styles.verticalDivider} />
                        </View>
                        <Typography>Small</Typography>
                    </Paper>
                    <Paper
                        elevation="raised"
                        style={styles.horizontalPaperContainer}
                    >
                        <View>
                            <View style={styles.verticalDivider} />
                            <Spacer.Horizontal amount="medium" />
                            <View style={styles.verticalDivider} />
                        </View>
                        <Typography>Medium</Typography>
                    </Paper>
                    <Paper
                        elevation="raised"
                        style={styles.horizontalPaperContainer}
                    >
                        <View>
                            <View style={styles.verticalDivider} />
                            <Spacer.Horizontal amount="large" />
                            <View style={styles.verticalDivider} />
                        </View>
                        <Typography>Large</Typography>
                    </Paper>
                </View>
                <ViewCode title="Horizontal Spacer" code={horizontalSpacer} />
            </Section>

            <CodeSnippetDialog />
        </ScrollView>
    );
}

const tokenStyles = EDSStyleSheet.create((token) => ({
    horizontalDivider: {
        width: "100%",
        height: token.newSpacing.sizing.stroke.thin,
        backgroundColor: token.newColors.Border.Neutral.Medium,
    },
    verticalDivider: {
        width: token.newSpacing.sizing.stroke.thin,
        height: token.newSpacing.sizing.icon["6xl"],
        backgroundColor: token.newColors.Border.Neutral.Medium,
    },
    verticalPaperContainer: {
        gap: token.newSpacing.spacing.horizontal.md,
        paddingHorizontal: token.newSpacing.spacing.inset.md.horizontal,
        paddingVertical: token.newSpacing.spacing.inset.md["vertical-squished"],
    },
    horizontalPaperContainer: {
        flex: 1,
        gap: token.newSpacing.spacing.vertical.md,
        paddingHorizontal: token.newSpacing.spacing.inset.md.horizontal,
        paddingVertical: token.newSpacing.spacing.inset.md["vertical-squished"],
    },
    horizontalPaperRow: {
        gap: token.newSpacing.spacing.horizontal.lg,
        flexDirection: "row",
        alignItems: "center",
    },
}));
