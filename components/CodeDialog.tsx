import { Button, Dialog } from "@equinor/eds-mobile-components";
import * as Clipboard from "expo-clipboard";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";

interface CodeDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    code: string;
}

const screenHeight = Dimensions.get("window").height;

export function CodeDialog({ isOpen, onClose, title, code }: CodeDialogProps) {
    const handleCopy = async () => {
        await Clipboard.setStringAsync(code);
        alert("Code copied!");
    };

    // Calculate dynamic height based on content, capped at 60% of screen
    const estimatedLines = code.split("\n").length;
    const lineHeight = 18;
    const contentHeight = estimatedLines * lineHeight + 32; // +32 for padding
    const maxHeight = Math.min(contentHeight, screenHeight * 0.6);

    return (
        <Dialog isOpen={isOpen} onScrimPress={onClose}>
            <Dialog.Header>{title}</Dialog.Header>
            <Dialog.CustomContent>
                <ScrollView
                    style={[styles.codeScrollView, { maxHeight }]}
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={true}
                >
                    <View style={styles.codeContainer}>
                        <Text style={styles.codeText}>{code}</Text>
                    </View>
                </ScrollView>
            </Dialog.CustomContent>
            <Dialog.Actions>
                <Button
                    label="Copy Code"
                    variant="secondary"
                    onPress={handleCopy}
                />
                <Button label="Close" onPress={onClose} />
            </Dialog.Actions>
        </Dialog>
    );
}

const styles = StyleSheet.create({
    codeContainer: {
        backgroundColor: "#f5f5f5",
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#e0e0e0",
    },
    codeScrollView: {
        // maxHeight applied dynamically based on content
    },
    codeText: {
        fontFamily: "monospace",
        fontSize: 13,
        color: "#333",
        lineHeight: 18,
    },
});
