import { basicScrim } from "@/codeSnippets/scrim";
import { useCodeSnippet } from "@/hooks/useCodeSnippet";
import {
    Button,
    Scrim,
    Spacer,
    Typography,
} from "@equinor/eds-mobile-components";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function ScrimScreen() {
    const { ViewCode, CodeSnippetDialog } = useCodeSnippet();
    const [scrimOpen, setScrimOpen] = useState(false);

    return (
        <>
            <ScrollView style={styles.container}>
                <View style={styles.section}>
                    <Typography variant="h5">Scrim</Typography>
                    <Typography variant="p">
                        A scrim is a semi-transparent overlay that dims the
                        background. It focuses attention on foreground content
                        like dialogs or menus, and can be tapped to dismiss.
                    </Typography>
                </View>

                <View style={styles.section}>
                    <Typography variant="h6">Scrim Overlay</Typography>
                    <Spacer amount="small" />
                    <Button
                        title="Show Scrim"
                        onPress={() => setScrimOpen(true)}
                    />
                    <ViewCode title="Basic Scrim" code={basicScrim} />
                </View>

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
                        title="Close"
                        onPress={() => setScrimOpen(false)}
                        variant="outlined"
                    />
                </View>
            </Scrim>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    section: {
        marginBottom: 32,
    },
    description: {
        marginBottom: 16,
        opacity: 0.7,
    },
    listItem: {
        marginBottom: 8,
        opacity: 0.8,
    },
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
