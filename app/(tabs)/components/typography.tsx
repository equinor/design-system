import { Section } from "@/components/Section";
import { Surface } from "@/components/Surface";
import {
    EDSStyleSheet,
    Spacer,
    Typography,
    useStyles,
} from "@equinor/eds-mobile-components";
import { ScrollView, View } from "react-native";

export default function TypographyScreen() {
    const styles = useStyles(themeStyles);

    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            <Section>
                <Typography>
                    Typography presets define font size, line height, weight,
                    and font family. Each preset is designed for a specific use
                    case.
                </Typography>
            </Section>

            <Section title="Display">
                <Typography>
                    Display presets are for the most prominent text on a screen
                    — page titles, onboarding headlines, or feature
                    introductions. They set the visual hierarchy and should
                    typically appear only once per screen.
                </Typography>
            </Section>
            <Surface>
                <View style={styles.row}>
                    <Typography variant="display.lg">Display lg</Typography>
                    <Typography variant="caption">
                        Equinor Medium 34/41
                    </Typography>
                </View>
                <View style={styles.divider} />
                <View style={styles.row}>
                    <Typography variant="display.md">Display md</Typography>
                    <Typography variant="caption">
                        Equinor Medium 28/34
                    </Typography>
                </View>
                <View style={styles.divider} />
                <View style={styles.row}>
                    <Typography variant="display.sm">Display sm</Typography>
                    <Typography variant="caption">
                        Equinor Medium 22/28
                    </Typography>
                </View>
            </Surface>

            <Section title="Heading">
                <Typography>
                    Headings organize content into scannable sections. Use them
                    for card titles, section headers, and group labels where you
                    need clear visual separation without the weight of a display
                    preset.
                </Typography>
            </Section>
            <Surface>
                <View style={styles.row}>
                    <Typography variant="heading.lg">Heading lg</Typography>
                    <Typography variant="caption">
                        Equinor Medium 20/25
                    </Typography>
                </View>
                <View style={styles.divider} />
                <View style={styles.row}>
                    <Typography variant="heading.md">Heading md</Typography>
                    <Typography variant="caption">
                        Equinor Medium 17/22
                    </Typography>
                </View>
                <View style={styles.divider} />
                <View style={styles.row}>
                    <Typography variant="heading.sm">Heading sm</Typography>
                    <Typography variant="caption">
                        Equinor Medium 15/20
                    </Typography>
                </View>
            </Surface>

            <Section title="Body">
                <Typography>
                    Body presets are the workhorse of your typography — used for
                    paragraphs, descriptions, cell content, and any longer-form
                    text. The default preset for the Typography component is
                    body.md.
                </Typography>
            </Section>
            <Surface>
                <View style={styles.row}>
                    <Typography variant="body.lg">Body lg</Typography>
                    <Typography variant="caption">Inter 17/22</Typography>
                </View>
                <View style={styles.divider} />
                <View style={styles.row}>
                    <Typography variant="body.md">Body md</Typography>
                    <Typography variant="caption">Inter 15/20</Typography>
                </View>
                <View style={styles.divider} />
                <View style={styles.row}>
                    <Typography variant="body.sm">Body sm</Typography>
                    <Typography variant="caption">Inter 13/18</Typography>
                </View>
            </Surface>

            <Section title="Label">
                <Typography>
                    Labels pair with interactive elements — form fields, inputs,
                    toggles, and selection controls. They are sized for compact
                    UI where readability matters.
                </Typography>
            </Section>
            <Surface>
                <View style={styles.row}>
                    <Typography variant="label.lg">Label lg</Typography>
                    <Typography variant="caption">Inter 15/20</Typography>
                </View>
                <View style={styles.divider} />
                <View style={styles.row}>
                    <Typography variant="label.md">Label md</Typography>
                    <Typography variant="caption">Inter 13/18</Typography>
                </View>
                <View style={styles.divider} />
                <View style={styles.row}>
                    <Typography variant="label.sm">Label sm</Typography>
                    <Typography variant="caption">Inter 12/16</Typography>
                </View>
            </Surface>

            <Section title="Standalone">
                <Typography>
                    These presets serve specific roles that don&apos;t fit into
                    the scaled groups above. Caption is for fine print and
                    metadata, button is for interactive button labels, and
                    overline is for category markers or small uppercase
                    annotations.
                </Typography>
            </Section>
            <Surface>
                <View style={styles.row}>
                    <Typography variant="button">Button</Typography>
                    <Typography variant="caption">Inter 17/22</Typography>
                </View>
                <View style={styles.divider} />
                <View style={styles.row}>
                    <Typography variant="overline">Overline</Typography>
                    <Typography variant="caption">Inter 12/16</Typography>
                </View>
                <View style={styles.divider} />
                <View style={styles.row}>
                    <Typography variant="caption">Caption</Typography>
                    <Typography variant="caption">Inter 11/13</Typography>
                </View>
            </Surface>

            <Spacer />
        </ScrollView>
    );
}

const themeStyles = EDSStyleSheet.create((token) => ({
    row: {
        gap: token.newSpacing.spacing.vertical.twoXs,
    },
    divider: {
        height: token.newSpacing.sizing.stroke.thin,
        backgroundColor: token.newColors.border.neutral.subtle,
    },
}));
