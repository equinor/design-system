import {
    iconButtons,
    statesButtons,
    toggleButtons,
    variantButtons,
} from "@/codeSnippets/buttons";
import { useCodeSnippet } from "@/hooks/useCodeSnippet";
import { Button, Spacer, Typography } from "@equinor/eds-mobile-components";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function ButtonsScreen() {
    const [togglePressed, setTogglePressed] = useState(false);
    const { ViewCode, CodeSnippetDialog } = useCodeSnippet();

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Typography variant="h5">Button</Typography>
                <Typography variant="p">
                    Buttons let users take action with a single tap — submitting
                    forms, triggering events, or navigating through your app.
                </Typography>
            </View>

            <View style={styles.section}>
                <Typography variant="h6">Colours & States</Typography>
                <View style={styles.buttonGroup}>
                    <Button
                        title="Primary Button"
                        color="primary"
                        onPress={() => alert("Primary Button pressed")}
                    />
                    <Button
                        title="Secondary Button"
                        color="secondary"
                        onPress={() => alert("Secondary Button pressed")}
                    />
                    <Button
                        title="Danger Button"
                        color="danger"
                        onPress={() => alert("Danger Button pressed")}
                    />
                    <Button
                        title="Disabled Button"
                        variant="contained"
                        disabled
                        onPress={() => alert("Disabled Button pressed")}
                    />
                    <ViewCode title="Button Variations" code={statesButtons} />
                </View>
                <Spacer amount="small" />
                <Typography variant="h6">Variants</Typography>
                <View style={styles.buttonGroup}>
                    <Button
                        title="Contained Button"
                        variant="contained"
                        onPress={() => alert("Contained Button pressed")}
                    />

                    <Button
                        title="Outlined Button"
                        color="secondary"
                        variant="outlined"
                        onPress={() => alert("Outlined Button pressed")}
                    />

                    <Button
                        title="Ghost Button"
                        variant="ghost"
                        onPress={() => alert("Ghost Button pressed")}
                    />
                    <ViewCode title="Button Variants" code={variantButtons} />
                </View>
                <Typography variant="h6">Icon Buttons</Typography>
                <Typography variant="p">
                    Add icons to reinforce meaning or create compact, icon-only
                    buttons.
                </Typography>

                <Typography>Icon positions:</Typography>
                <View style={styles.row}>
                    <Button
                        title="Leading"
                        iconPosition="leading"
                        variant="outlined"
                        iconName="home-outline"
                    />
                    <Button
                        title="Trailing"
                        iconPosition="trailing"
                        iconName="send-outline"
                        variant="outlined"
                    />
                </View>

                <Spacer amount="small" />
                <Typography variant="p">Just Icons</Typography>
                <View style={styles.row}>
                    <Button.Icon
                        name="heart"
                        onPress={() => alert("Heart Button pressed")}
                    />

                    <Button.Icon
                        name="star"
                        variant="outlined"
                        onPress={() => alert("Star Button pressed")}
                    />

                    <Button.Icon
                        name="close"
                        variant="ghost"
                        onPress={() => alert("Close Button pressed")}
                    />

                    <Button.Icon
                        name="check"
                        disabled
                        onPress={() => alert("Disabled Check Button pressed")}
                    />
                </View>
                <ViewCode title="Icon Buttons" code={iconButtons} />
            </View>
            <View style={styles.section}>
                <Typography variant="h6">Toggle Button Group</Typography>

                <Button.Toggle activeIndex={togglePressed ? 1 : 0}>
                    <Button
                        title="Option 1"
                        onPress={() => setTogglePressed(false)}
                    />
                    <Button
                        title="Option 2"
                        onPress={() => setTogglePressed(true)}
                    />
                </Button.Toggle>
                <ViewCode title="Toggle Button Group" code={toggleButtons} />
            </View>
            <CodeSnippetDialog />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    section: {
        padding: 10,
        gap: 16,
    },
    buttonGroup: {
        gap: 12,
    },
    row: {
        flexDirection: "row",
        gap: 12,
        flexWrap: "wrap",
    },
});
