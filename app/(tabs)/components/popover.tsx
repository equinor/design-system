import { basicPopover, popoverWithActions } from "@/codeSnippets/popover";
import { useCodeSnippet } from "@/hooks/useCodeSnippet";
import { Button, Popover, Typography } from "@equinor/eds-mobile-components";
import { useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function PopoverScreen() {
    const [popoverOpen1, setPopoverOpen1] = useState(false);
    const [popoverOpen2, setPopoverOpen2] = useState(false);
    const anchorRef1 = useRef<View>(null as any);
    const anchorRef2 = useRef<View>(null as any);
    const { ViewCode, CodeSnippetDialog } = useCodeSnippet();

    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            <View style={styles.section}>
                <Typography variant="p">
                    Popovers display content in a floating container anchored to
                    a trigger element — helpful for additional context or quick
                    actions without navigating away.
                </Typography>
            </View>

            <View style={styles.section}>
                <Typography variant="h6">Basic Popover</Typography>

                <View ref={anchorRef1}>
                    <Button
                        title="Show Popover"
                        onPress={() => setPopoverOpen1(true)}
                    />
                </View>

                <Popover
                    anchorEl={anchorRef1}
                    open={popoverOpen1}
                    onClose={() => setPopoverOpen1(false)}
                >
                    <View style={styles.popoverContent}>
                        <Typography variant="p">This is a popover!</Typography>
                        <Typography style={styles.popoverText}>
                            Popovers are great for displaying additional
                            information.
                        </Typography>
                    </View>
                </Popover>

                <ViewCode title="Basic Popover" code={basicPopover} />
            </View>

            <View style={styles.section}>
                <Typography variant="h6">Popover with Actions</Typography>

                <View ref={anchorRef2}>
                    <Button
                        title="Show Popover with Actions"
                        onPress={() => setPopoverOpen2(true)}
                    />
                </View>

                <Popover
                    anchorEl={anchorRef2}
                    open={popoverOpen2}
                    onClose={() => setPopoverOpen2(false)}
                >
                    <View style={styles.popoverContent}>
                        <Typography variant="p" bold>
                            Quick Actions
                        </Typography>
                        <Typography style={styles.popoverText}>
                            You can add any content inside a popover, including
                            buttons and interactive elements.
                        </Typography>
                        <Button
                            title="Close"
                            onPress={() => setPopoverOpen2(false)}
                            variant="outlined"
                        />
                    </View>
                </Popover>

                <ViewCode
                    title="Popover with Actions"
                    code={popoverWithActions}
                />
            </View>

            <View style={styles.section}>
                <Typography variant="p">
                    Tap the buttons above to see popovers in action
                </Typography>
            </View>

            <CodeSnippetDialog />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    section: {
        padding: 16,
        gap: 16,
    },
    popoverContent: {
        padding: 16,
        gap: 12,
        maxWidth: 300,
    },
    popoverText: {
        marginTop: 4,
    },
});
