import { navigationCell, swipeableCell } from "@/codeSnippets/cell";
import { useCodeSnippet } from "@/hooks/useCodeSnippet";
import { Cell, Typography } from "@equinor/eds-mobile-components";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function CellScreen() {
    const router = useRouter();
    const [switchValue, setSwitchValue] = useState(false);
    const { ViewCode, CodeSnippetDialog } = useCodeSnippet();

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Typography variant="h5">Cell</Typography>
                <Typography variant="p">
                    Cells are versatile list items for displaying content,
                    navigation, or actions. Group them together for settings
                    screens, menus, or data lists.
                </Typography>
            </View>

            <View style={styles.section}>
                <Typography variant="h6">Navigation Cell</Typography>

                <Cell.Group>
                    <Cell.Navigation
                        title="Navigate to Settings"
                        onPress={() =>
                            router.push({
                                pathname: "/(tabs)/components/cell-detail",
                                params: { title: "Settings" },
                            })
                        }
                    />

                    <Cell.Navigation
                        title="Notifications"
                        description="Manage your notifications"
                        iconName="bell"
                        onPress={() =>
                            router.push({
                                pathname: "/(tabs)/components/cell-detail",
                                params: {
                                    title: "Notifications",
                                    description: "Manage your notifications",
                                },
                            })
                        }
                    />
                </Cell.Group>

                <ViewCode title="Navigation Cell" code={navigationCell} />
            </View>
            <View style={styles.section}>
                <Typography variant="h6">Swipeable Cells</Typography>
                <Typography variant="p">
                    Reveal hidden actions by swiping left or right. Great for
                    quick actions like delete, archive, or share.
                </Typography>
                <Cell.Group>
                    <Cell
                        rightSwipeGroup={[
                            {
                                title: "hello world",
                            },
                        ]}
                    >
                        <Typography>
                            This cell has right swipe items.
                        </Typography>
                    </Cell>
                    <Cell
                        leftSwipeGroup={[
                            {
                                title: "first",
                                iconName: "nature",
                            },
                            {
                                title: "second",
                                iconName: "water",
                                color: "warning",
                            },
                            {
                                title: "third",
                                iconName: "star",
                                color: "danger",
                            },
                        ]}
                    >
                        <Typography>
                            This cell has left swipe, with multiple items.
                        </Typography>
                    </Cell>
                    <Cell
                        leftSwipeGroup={[
                            {
                                iconName: "human-male",
                                color: "success",
                            },
                            {
                                iconName: "human-female",
                                color: "secondary",
                            },
                        ]}
                        rightSwipeGroup={[
                            {
                                iconName: "face-man",
                                color: "warning",
                            },
                            {
                                iconName: "face-woman",
                                color: "primary",
                            },
                        ]}
                    >
                        <Typography>
                            This cell has both, with icons only
                        </Typography>
                    </Cell>
                </Cell.Group>

                <ViewCode title="Swipeable Cells" code={swipeableCell} />
            </View>

            <View style={styles.section}>
                <Typography variant="h6">Switch Cell</Typography>

                <Cell.Group>
                    <Cell.Switch
                        title="Enable Notifications"
                        isActive={switchValue}
                        onChange={setSwitchValue}
                    />

                    <Cell.Switch
                        title="Disabled Switch"
                        description="This switch is disabled"
                        isActive={false}
                        onChange={() => {}}
                        disabled
                    />
                </Cell.Group>
            </View>

            <View style={styles.section}>
                <Typography variant="h6">Button Cell</Typography>

                <Cell.Group>
                    <Cell.Button
                        title="Primary Action"
                        onPress={() => alert("Primary action")}
                    />

                    <Cell.Button
                        title="Delete Action"
                        description="This action cannot be undone"
                        color="danger"
                        iconName="delete"
                        onPress={() => alert("Delete action")}
                    />
                </Cell.Group>
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
        padding: 16,
        gap: 16,
    },
});
