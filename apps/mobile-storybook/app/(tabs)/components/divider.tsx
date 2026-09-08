import { Section } from "@/components/Section";
import { Surface } from "@/components/Surface";
import {
    Divider,
    EDSStyleSheet,
    Typography,
    useStyles,
} from "@equinor/eds-mobile-components";
import { ScrollView } from "react-native";

export default function DividerScreen() {
    const styles = useStyles(themeStyles);

    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            <Section>
                <Typography>
                    Divider is a thin horizontal line used to separate content
                    sections visually.
                </Typography>
            </Section>

            <Section title="Default" />
            <Surface>
                <Typography>Above the divider</Typography>
                <Divider />
                <Typography>Below the divider</Typography>
            </Surface>

            <Section title="With spacing">
                <Typography>
                    Use the style prop to add vertical margin.
                </Typography>
            </Section>
            <Surface>
                <Typography size="md">
                    The Equinor Design System provides a consistent visual
                    language across all digital products.
                </Typography>
                <Divider style={styles.dividerSpacing} />
                <Typography.Header size="md" weight="bolder">
                    Themes and Density
                </Typography.Header>
                <Typography size="md">
                    Components are built to support both light and dark themes
                    and adapt to comfortable and spacious density modes.
                </Typography>
            </Surface>
        </ScrollView>
    );
}

const themeStyles = EDSStyleSheet.create((token) => ({
    dividerSpacing: {
        marginVertical: token.spacing.spacing.vertical.md,
    },
}));
