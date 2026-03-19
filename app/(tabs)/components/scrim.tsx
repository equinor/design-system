import { basicScrim } from "@/codeSnippets/scrim";
import { Section } from "@/components/Section";
import { useCodeSnippet } from "@/hooks/useCodeSnippet";
import { Button, Scrim, Typography } from "@equinor/eds-mobile-components";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function ScrimScreen() {
    const { ViewCode, CodeSnippetDialog } = useCodeSnippet();
    const [scrimOpen, setScrimOpen] = useState(false);

    return (
        <>
            <ScrollView contentInsetAdjustmentBehavior="automatic">
                <Section>
                    <Typography variant="p">
                        A scrim is a semi-transparent overlay that dims the
                        background. It focuses attention on foreground content
                        like dialogs or menus, and can be tapped to dismiss.
                    </Typography>
                </Section>

                <Section title="Scrim overlay">
                    <Button
                        label="Show Scrim"
                        onPress={() => setScrimOpen(true)}
                    />
                    <ViewCode title="Basic Scrim" code={basicScrim} />
                </Section>

                <CodeSnippetDialog />
            </ScrollView>

            <Scrim isOpen={scrimOpen} onPress={() => setScrimOpen(false)}>
                <View style={styles.scrimContent}>
                    <Typography variant="h5" style={styles.scrimText}>
                        Scrim Content
                    </Typography>
                    <Typography style={styles.scrimText}>
                        This content appears on top of the scrim overlay.
                    </Typography>
                    <Typography style={styles.scrimText}>
                        Tap the dark area to close.
                    </Typography>
                    <Button
                        label="Close"
                        onPress={() => setScrimOpen(false)}
                        variant="secondary"
                    />
                </View>
            </Scrim>
        </>
    );
}

const styles = StyleSheet.create({
    scrimContent: {
        backgroundColor: "white",
        padding: 24,
        margin: 20,
        borderRadius: 12,
        gap: 16,
    },
    scrimText: {
        color: "#000",
    },
});
