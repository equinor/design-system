import { Section } from "@/components/Section";
import { Surface } from "@/components/Surface";
import { Button, EDSStyleSheet, Spacer, Typography, useStyles } from "@equinor/eds-mobile-components";
import { ScrollView, View } from "react-native";

export default function ButtonsScreen() {
    const styles = useStyles(themeStyles);

    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            <Section>
                <Typography>
                    Buttons let users take action with a single tap — submitting
                    forms, triggering events, or navigating through your app.
                </Typography>
            </Section>

            <Section title="Tones">
                <Typography>
                    Buttons come in three tones. These can be used to indicate
                    importance.
                </Typography>
            </Section>
            <Surface>
                <View style={styles.buttonRow}>
                    <Button label="Accent" tone="accent" />
                    <Button label="Neutral" tone="neutral" />
                    <Button label="Danger" tone="danger" />
                </View>
            </Surface>

            <Section title="Variants">
                <Typography>
                    Buttons come in three different variants:
                </Typography>
            </Section>
            <Surface>
                <View style={styles.buttonRow}>
                    <Button label="Primary" variant="primary" />
                    <Button label="Secondary" variant="secondary" />
                    <Button label="Ghost" variant="ghost" />
                </View>
            </Surface>

            <Section title="Sizes">
                <Typography>Buttons are available in three sizes.</Typography>
            </Section>
            <Surface>
                <View style={styles.buttonRow}>
                    <Button label="Small" size="small" />
                    <Button label="Default" size="default" />
                    <Button label="Large" size="large" />
                </View>
            </Surface>

            <Section title="Variations">
                <Typography>
                    Combining tones and variants creates a range of button
                    styles to choose from.
                </Typography>
            </Section>
            <Surface>
                <View style={styles.buttonRow}>
                    <Button label="Label" tone="accent" variant="primary" />
                    <Button label="Label" tone="accent" variant="secondary" />
                    <Button label="Label" tone="accent" variant="ghost" />
                </View>

                <View style={styles.buttonRow}>
                    <Button label="Label" tone="neutral" variant="primary" />
                    <Button label="Label" tone="neutral" variant="secondary" />
                    <Button label="Label" tone="neutral" variant="ghost" />
                </View>

                <View style={styles.buttonRow}>
                    <Button label="Label" tone="danger" variant="primary" />
                    <Button label="Label" tone="danger" variant="secondary" />
                    <Button label="Label" tone="danger" variant="ghost" />
                </View>
            </Surface>

            <Section title="With icons">
                <Typography>
                    You can add icons to buttons to provide additional context
                    and visual interest.
                </Typography>
            </Section>
            <Surface>
                <View style={styles.buttonRow}>
                    <Button label="Leading" leadingIcon="home-outline" />
                    <Button label="Trailing" trailingIcon="send-outline" />
                    <Button
                        label="Both"
                        leadingIcon="pan-left"
                        trailingIcon="pan-right"
                    />
                </View>
            </Surface>

            <Section title="Icon buttons">
                <Typography>
                    Icon buttons are a compact variant of the button component,
                    containing only an icon. They are used for actions where
                    space is limited, or where the action can be easily
                    represented by an icon.
                </Typography>
            </Section>
            <Surface>
                <Typography>Rounded corners</Typography>
                <View style={styles.buttonRow}>
                    <Button.Icon name="heart" />
                    <Button.Icon name="star" variant="secondary" />
                    <Button.Icon name="close" variant="ghost" />
                </View>
                <Typography>Circular</Typography>
                <View style={styles.buttonRow}>
                    <Button.Icon name="heart" round />
                    <Button.Icon name="star" round variant="secondary" />
                    <Button.Icon name="close" round variant="ghost" />
                </View>
            </Surface>

            <Section title="States">
                <Typography>Buttons can be disabled</Typography>
            </Section>
            <Surface>
                <View style={styles.buttonRow}>
                    <Button label="Disabled" disabled />
                    <Button.Icon name="cancel" disabled />
                    <Button.Icon name="cancel" round disabled />
                </View>
            </Surface>

            <Spacer />
        </ScrollView>
    );
}

const themeStyles = EDSStyleSheet.create((token) => ({
    buttonRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-evenly",
        alignItems: "center",
        rowGap: token.newSpacing.spacing.vertical.md,
    },
}));