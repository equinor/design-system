import {
    EDSStyleSheet,
    Icon,
    Typography,
    useStyles,
} from "@equinor/eds-mobile-components";
import { useRouter } from "expo-router";
import { Pressable, SectionList, View } from "react-native";

type ComponentItem = { name: string; route: string };

const sections = [
    {
        title: "Actions",
        data: [{ name: "Button", route: "button" }],
    },
    {
        title: "Data Display",
        data: [{ name: "Typography", route: "typography" }],
    },
    {
        title: "Data Entry",
        data: [
            { name: "Input", route: "input" },
            { name: "Selection Controls", route: "selectioncontrols" },
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
        <Pressable
            onPress={() => navigateTo(item.route)}
            style={styles.row}
        >
            <Typography>{item.name}</Typography>
            <Icon name="chevron-right" size={20} color={styles.chevron.color} />
        </Pressable>
    );

    const renderSectionHeader = ({
        section,
    }: {
        section: { title: string };
    }) => (
        <Typography size="sm" style={styles.sectionTitle}>
            {section.title.toUpperCase()}
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
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: token.newSpacing.spacing.inset.md.verticalSquished,
        paddingHorizontal: token.newSpacing.spacing.inset.xl.horizontal,
        backgroundColor: token.newColors.bg.neutral.surface,
    },
    chevron: {
        color: token.newColors.text.neutral.subtle,
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
        color: token.newColors.text.neutral.subtle,
    },
}));
