import { basicChips, deletableChips } from "@/codeSnippets/chips";
import { useCodeSnippet } from "@/hooks/useCodeSnippet";
import {
    Button,
    Chip,
    Dialog,
    Popover,
    Typography,
} from "@equinor/eds-mobile-components";
import { useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function ChipsScreen() {
    const [dialogVisible, setDialogVisible] = useState(false);
    const [popoverVisible, setPopoverVisible] = useState(false);
    const [deleteChipVisible, setDeleteChipVisible] = useState(false);
    const popoverAnchorRef = useRef<View>(null!);
    const { ViewCode, CodeSnippetDialog } = useCodeSnippet();

    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            <View style={styles.section}>
                <Typography variant="p">
                    Chips are compact elements for filtering, selecting, or
                    displaying small pieces of information like tags or
                    categories.
                </Typography>
            </View>

            <View style={styles.section}>
                <Typography variant="h6">Basic Chips</Typography>

                <View style={styles.row}>
                    <Chip
                        title="Default Chip"
                        onPress={() => console.log("Chip pressed")}
                    />

                    <Chip
                        title="Active Chip"
                        variant="active"
                        onPress={() => console.log("Active chip pressed")}
                    />

                    <Chip
                        title="Disabled"
                        disabled
                        onPress={() => console.log("This won't fire")}
                    />
                </View>

                <ViewCode title="Basic Chips" code={basicChips} />
            </View>

            <View style={styles.section}>
                <Typography variant="h6">Chip Variants</Typography>

                <View style={styles.row}>
                    <Chip
                        title="Default"
                        variant="default"
                        onPress={() => console.log("Default chip")}
                    />

                    <Chip
                        title="Active"
                        variant="active"
                        onPress={() => console.log("Active chip")}
                    />

                    <Chip
                        title="Error"
                        variant="error"
                        onPress={() => console.log("Error chip")}
                    />
                </View>

                <View style={styles.row}>
                    <Chip
                        title="Alert Chip"
                        variant="active"
                        onPress={() => alert("You clicked the alert chip!")}
                    />

                    <View ref={popoverAnchorRef}>
                        <Chip
                            title="Popover Chip"
                            variant="default"
                            onPress={() => setPopoverVisible(true)}
                        />
                    </View>

                    <Chip
                        title="Dialog Chip"
                        variant="error"
                        onPress={() => setDialogVisible(true)}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Typography variant="h6">Deletable Chips</Typography>

                <View style={styles.row}>
                    {deleteChipVisible ? (
                        ""
                    ) : (
                        <Chip
                            title="Delete Me!"
                            onDelete={() => setDeleteChipVisible(true)}
                            onPress={() => console.log("chip pressed")}
                        />
                    )}
                    <Chip
                        title="Deletable Error"
                        variant="error"
                        onDelete={() => console.log("Delete pressed")}
                        onPress={() => console.log("Chip pressed")}
                    />
                </View>

                <ViewCode title="Deletable Chips" code={deletableChips} />
            </View>

            <Dialog
                isOpen={dialogVisible}
                onScrimPress={() => setDialogVisible(false)}
            >
                <Dialog.Header>Active Chip Pressed</Dialog.Header>
                <Dialog.CustomContent>
                    <Typography variant="p">
                        You clicked the Active Chip! This dialog demonstrates
                        how chips can trigger dialogs for user interactions.
                    </Typography>
                </Dialog.CustomContent>
                <Dialog.Actions>
                    <Button
                        label="Close"
                        onPress={() => setDialogVisible(false)}
                    />
                </Dialog.Actions>
            </Dialog>

            <Popover
                anchorEl={popoverAnchorRef}
                open={popoverVisible}
                onClose={() => setPopoverVisible(false)}
                placement="top"
            >
                <View style={styles.popoverContent}>
                    <Typography variant="p">Chip Popover</Typography>
                </View>
            </Popover>

            <CodeSnippetDialog />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    section: {
        padding: 20,
        gap: 16,
    },
    row: {
        flexDirection: "row",
        gap: 12,
        flexWrap: "wrap",
    },
    popoverContent: {
        padding: 16,
    },
});
