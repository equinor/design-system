import { Cell, Typography } from "@equinor/eds-mobile-components";
import { useRouter } from "expo-router";
import { SectionList, StyleSheet, View } from "react-native";

type ComponentItem = { name: string; route: string };

const sections = [
    {
        title: "Actions",
        data: [{ name: "Button", route: "buttons" }],
    },
    {
        title: "Data Display",
        data: [
            { name: "Cell", route: "cell" },
            { name: "Chip", route: "chips" },
            { name: "Icon", route: "icon" },
            { name: "Label", route: "label" },
        ],
    },
    {
        title: "Data Entry",
        data: [
            { name: "Autocomplete", route: "autocomplete" },
            { name: "Input", route: "input" },
            { name: "Search", route: "search" },
            { name: "Select", route: "select" },
            { name: "Selection Controls", route: "selectioncontrols" },
            { name: "TextField", route: "textfield" },
        ],
    },
    {
        title: "Feedback",
        data: [
            { name: "Dialog", route: "dialogs" },
            { name: "Environment", route: "environment" },
            { name: "Offline Banner", route: "offlinebanner" },
            { name: "Progress", route: "progress" },
            { name: "Progress Indicator", route: "progressindicator" },
        ],
    },
    {
        title: "Surfaces",
        data: [
            { name: "Accordion", route: "accordion" },
            { name: "Paper", route: "paper" },
        ],
    },
    {
        title: "Navigation",
        data: [
            { name: "Menu", route: "menu" },
            { name: "Tabs", route: "tabs" },
        ],
    },
    {
        title: "Utilities",
        data: [
            { name: "Popover", route: "popover" },
            { name: "Scrim", route: "scrim" },
            { name: "Spacer", route: "spacer" },
        ],
    },
];

export default function ComponentsIndex() {
    const router = useRouter();

    const navigateTo = (route: string) => {
        router.push(`/(tabs)/components/${route}` as any);
    };

    const renderItem = ({ item }: { item: ComponentItem }) => (
        <Cell.Navigation
            title={item.name}
            onPress={() => navigateTo(item.route)}
        />
    );

    const renderSectionHeader = ({
        section,
    }: {
        section: { title: string };
    }) => (
        <Typography variant="h6" style={styles.sectionHeader}>
            {section.title}
        </Typography>
    );

    const renderHeader = () => (
        <View style={styles.header}>
            <Typography variant="h5">Components</Typography>
            <Typography variant="p" style={styles.subtitle}>
                Tap a component to explore its variants and usage.
            </Typography>
        </View>
    );

    return (
        <SectionList
            style={styles.container}
            sections={sections}
            keyExtractor={(item) => item.route}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            ListHeaderComponent={renderHeader}
            stickySectionHeadersEnabled={true}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        padding: 16,
        gap: 8,
    },
    subtitle: {
        color: "#555",
    },
    sectionHeader: {
        fontSize: 14,
        backgroundColor: "#eeececff",
        color: "#6F6F6F",
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
});
