import {
    Cell,
    EDSStyleSheet,
    Typography,
    useStyles,
} from "@equinor/eds-mobile-components";
import { useRouter } from "expo-router";
import { SectionList, View } from "react-native";

type ComponentItem = { name: string; route: string };

const sections = [
    {
        title: "Actions",
        data: [{ name: "Button", route: "button" }],
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
    const styles = useStyles(tokenStyles);

    const navigateTo = (route: string) => {
        router.push(`/(tabs)/components/${route}` as any);
    };

    const renderItem = ({ item }: { item: ComponentItem }) => (
        <Cell.Navigation
            title={item.name}
            onPress={() => navigateTo(item.route)}
            style={{ borderTopWidth: 0, borderBottomWidth: 0 }}
        />
    );

    const renderSectionHeader = ({
        section,
    }: {
        section: { title: string };
    }) => (
        <Typography variant="h6" style={styles.sectionTitle}>
            {section.title}
        </Typography>
    );

    return (
        <SectionList
            contentContainerStyle={styles.contentContainer}
            sections={sections}
            keyExtractor={(item) => item.route}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            stickySectionHeadersEnabled={true}
            ItemSeparatorComponent={() => <View style={styles.cellDivider} />}
            SectionSeparatorComponent={() => (
                <View style={styles.sectionSeparator} />
            )}
            contentInsetAdjustmentBehavior="automatic"
        />
    );
}

const tokenStyles = EDSStyleSheet.create((token) => ({
    contentContainer: {
        backgroundColor: token.newColors.bg.neutral.surface,
    },
    cellDivider: {
        height: token.newSpacing.sizing.stroke.thin,
        backgroundColor: token.newColors.border.neutral.medium,
        marginHorizontal: token.newSpacing.spacing.inset.xl.horizontal,
    },
    sectionSeparator: {
        height: token.newSpacing.sizing.stroke.thin,
        backgroundColor: token.newColors.border.neutral.medium,
    },
    sectionTitle: {
        paddingVertical: token.newSpacing.spacing.inset.md.verticalSquished,
        paddingHorizontal: token.newSpacing.spacing.inset.xl.horizontal,
        backgroundColor: token.newColors.bg.neutral.canvas,
    },
}));
