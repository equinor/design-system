import { navigationCell, swipeableCell } from "@/codeSnippets/cell";
import { Section } from "@/components/Section";
import { useCodeSnippet } from "@/hooks/useCodeSnippet";
import {
    Cell,
    EDSStyleSheet,
    Typography,
    useStyles,
} from "@equinor/eds-mobile-components";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView } from "react-native";

export default function CellScreen() {
    const router = useRouter();
    const styles = useStyles(tokenStyles);
    const [switchValue, setSwitchValue] = useState(false);
    const { ViewCode, CodeSnippetDialog } = useCodeSnippet();

    return (
        <ScrollView style={styles.container}>
            <Section title="Cell">
                <Typography variant="p">
                    Cells are versatile list items for displaying content,
                    navigation, or actions. Group them together for settings
                    screens, menus, or data lists.
                </Typography>
            </Section>
            <Section title="Navigation Cell" />
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

            <Section title="Swipeable cells">
                <Typography variant="p">
                    Reveal hidden actions by swiping left or right. Great for
                    quick actions like delete, archive, or share.
                </Typography>
            </Section>
            <Cell.Group>
                <Cell
                    rightSwipeGroup={[
                        {
                            title: "hello world",
                        },
                    ]}
                >
                    <Typography>This cell has right swipe items.</Typography>
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
                    <Typography>This cell has both, with icons only</Typography>
                </Cell>
            </Cell.Group>

            <ViewCode title="Swipeable Cells" code={swipeableCell} />

            <Section title="Switch Cell" />
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

            <Section title="Button Cell" />
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

            <CodeSnippetDialog />
        </ScrollView>
    );
}

const tokenStyles = EDSStyleSheet.create((token) => ({
    container: {
        flex: 1,
    },
    section: {
        padding: token.newSpacing.spacing.inset.lg.horizontal,
        gap: 16,
    },
}));
