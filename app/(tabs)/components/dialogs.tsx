import { basicDialog, dialogWithActions } from "@/codeSnippets/dialogs";
import { useCodeSnippet } from "@/hooks/useCodeSnippet";
import { Button, Dialog, Typography } from "@equinor/eds-mobile-components";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function DialogsScreen() {
    const [basicOpen, setBasicOpen] = useState(false);
    const [withActionsOpen, setWithActionsOpen] = useState(false);
    const [customOpen, setCustomOpen] = useState(false);
    const { ViewCode, CodeSnippetDialog } = useCodeSnippet();

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Typography variant="h5">Dialog</Typography>
                <Typography variant="p">
                    Dialogs pop up when you really need someone&apos;s attention
                    — a confirmation, a warning, or an important message.
                </Typography>
            </View>

            <View style={styles.section}>
                <Typography variant="h6">Basic Dialog</Typography>
                <Typography variant="p">
                    A straightforward dialog — show a message, let users tap
                    outside to close it. Nice and simple.
                </Typography>

                <Button
                    title="Open Basic Dialog"
                    onPress={() => setBasicOpen(true)}
                />

                <Dialog
                    isOpen={basicOpen}
                    onScrimPress={() => setBasicOpen(false)}
                >
                    <View style={styles.section}>
                        <Typography variant="h6">Basic Dialog</Typography>
                        <Typography variant="p">
                            This is a simple dialog with just a title and
                            content.
                        </Typography>
                    </View>
                </Dialog>

                <ViewCode title="Basic Dialog" code={basicDialog} />
            </View>

            <View style={styles.section}>
                <Typography variant="h6">Dialog with Actions</Typography>
                <Typography variant="p">
                    When you need a yes or no, add some buttons. Great for
                    confirmations or giving users a clear way out.
                </Typography>

                <Button
                    title="Open Dialog with Actions"
                    onPress={() => setWithActionsOpen(true)}
                />

                <Dialog
                    isOpen={withActionsOpen}
                    onScrimPress={() => setWithActionsOpen(false)}
                >
                    <View style={styles.section}>
                        <Typography variant="h6">Confirm Action</Typography>
                        <Typography variant="p">
                            Are you sure you want to proceed with this action?
                        </Typography>
                        <View style={styles.dialogActions}>
                            <Button
                                title="Cancel"
                                variant="ghost"
                                onPress={() => setWithActionsOpen(false)}
                            />
                            <Button
                                title="Confirm"
                                onPress={() => {
                                    console.log("Confirmed!");
                                    setWithActionsOpen(false);
                                }}
                            />
                        </View>
                    </View>
                </Dialog>

                <ViewCode
                    title="Dialog with Actions"
                    code={dialogWithActions}
                />
            </View>

            <View style={styles.section}>
                <Typography variant="h6">Custom Dialog</Typography>
                <Typography variant="p">
                    Need something more creative? Drop in your own content —
                    forms, images, whatever works for your use case.
                </Typography>

                <Button
                    title="Open Custom Dialog"
                    onPress={() => setCustomOpen(true)}
                />

                <Dialog
                    isOpen={customOpen}
                    onScrimPress={() => setCustomOpen(false)}
                >
                    <View style={styles.customContent}>
                        <Typography variant="h6">Custom Content</Typography>
                        <Typography variant="h5">
                            Additional Information
                        </Typography>
                        <Typography variant="p">
                            You can add any custom React Native components here.
                        </Typography>
                        <Button
                            title="Close"
                            variant="outlined"
                            onPress={() => setCustomOpen(false)}
                        />
                    </View>
                </Dialog>
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
        padding: 20,
        gap: 16,
    },
    customContent: {
        gap: 12,
        padding: 20,
    },
    dialogActions: {
        flexDirection: "row",
        gap: 12,
        justifyContent: "flex-end",
        marginTop: 16,
    },
});
