import { Section } from "@/components/Section";
import { Surface } from "@/components/Surface";
import {
    Badge,
    EDSStyleSheet,
    Typography,
    useStyles,
} from "@equinor/eds-mobile-components";
import { ScrollView, View } from "react-native";

export default function BadgeScreen() {
    const styles = useStyles(themeStyles);

    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            <Section>
                <Typography>
                    Badge labels content with status, category, or a numeric
                    value. Use it in table cells, list rows, and card headers.
                    It is non-interactive. For a notification indicator on top
                    of an icon or avatar, a dedicated notification badge
                    component is coming in a future release.
                </Typography>
            </Section>

            <Section title="Usage">
                <Typography>
                    Place a badge on the trailing edge of a row to communicate
                    status or a count at a glance.
                </Typography>
            </Section>
            <Surface>
                <View style={styles.listRow}>
                    <Typography>Work order &#35;1042</Typography>
                    <Badge tone="success" emphasis="medium">Approved</Badge>
                </View>
                <View style={styles.listRow}>
                    <Typography>Work order &#35;1043</Typography>
                    <Badge tone="warning" emphasis="medium">Pending</Badge>
                </View>
                <View style={styles.listRow}>
                    <Typography>Work order &#35;1044</Typography>
                    <Badge tone="danger" emphasis="medium">Rejected</Badge>
                </View>
                <View style={styles.listRow}>
                    <Typography>Documents</Typography>
                    <Badge tone="accent" emphasis="medium">{3}</Badge>
                </View>
            </Surface>

            <Section title="Tones" />
            <Surface>
                <View style={styles.row}>
                    <Badge tone="neutral" emphasis="medium">Neutral</Badge>
                    <Badge tone="accent" emphasis="medium">Accent</Badge>
                    <Badge tone="success" emphasis="medium">Success</Badge>
                    <Badge tone="info" emphasis="medium">Info</Badge>
                    <Badge tone="warning" emphasis="medium">Warning</Badge>
                    <Badge tone="danger" emphasis="medium">Danger</Badge>
                </View>
            </Surface>

            <Section title="Emphasis">
                <Typography>
                    Low uses the canvas background for a subtle indicator.
                    Medium uses a muted fill for stronger visual presence.
                </Typography>
            </Section>
            <Surface>
                <View style={styles.emphasisGrid}>
                    <View style={styles.emphasisColumn}>
                        <Typography size="sm" weight="bolder">Low</Typography>
                        <Badge tone="neutral" emphasis="low">Neutral</Badge>
                        <Badge tone="accent" emphasis="low">Accent</Badge>
                        <Badge tone="success" emphasis="low">Success</Badge>
                        <Badge tone="info" emphasis="low">Info</Badge>
                        <Badge tone="warning" emphasis="low">Warning</Badge>
                        <Badge tone="danger" emphasis="low">Danger</Badge>
                    </View>
                    <View style={styles.emphasisColumn}>
                        <Typography size="sm" weight="bolder">Medium</Typography>
                        <Badge tone="neutral" emphasis="medium">Neutral</Badge>
                        <Badge tone="accent" emphasis="medium">Accent</Badge>
                        <Badge tone="success" emphasis="medium">Success</Badge>
                        <Badge tone="info" emphasis="medium">Info</Badge>
                        <Badge tone="warning" emphasis="medium">Warning</Badge>
                        <Badge tone="danger" emphasis="medium">Danger</Badge>
                    </View>
                </View>
            </Surface>

            <Section title="Variant">
                <Typography>
                    Solid is the default variant. Use outlined when a filled badge would compete with other
                    elements on the page.
                </Typography>
            </Section>
            <Surface>
                <View style={styles.row}>
                    <Badge tone="neutral" variant="outlined">Neutral</Badge>
                    <Badge tone="accent" variant="outlined">Accent</Badge>
                    <Badge tone="success" variant="outlined">Success</Badge>
                    <Badge tone="info" variant="outlined">Info</Badge>
                    <Badge tone="warning" variant="outlined">Warning</Badge>
                    <Badge tone="danger" variant="outlined">Danger</Badge>
                </View>
            </Surface>

            <Section title="Numbers">
                <Typography>
                    Pass a number as children for count badges.
                </Typography>
            </Section>
            <Surface>
                <View style={styles.row}>
                    <Badge tone="accent" emphasis="medium">{1}</Badge>
                    <Badge tone="danger" emphasis="medium">{3}</Badge>
                    <Badge tone="neutral" emphasis="medium">{42}</Badge>
                    <Badge tone="info" emphasis="medium">{100}</Badge>
                </View>
            </Surface>
        </ScrollView>
    );
}

const themeStyles = EDSStyleSheet.create((token) => ({
    row: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        gap: token.spacing.spacing.horizontal.sm,
    },
    listRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    emphasisGrid: {
        flexDirection: "row",
        gap: token.spacing.spacing.horizontal.xl,
    },
    emphasisColumn: {
        gap: token.spacing.spacing.vertical.xs,
        alignItems: "flex-start",
    },
}));
