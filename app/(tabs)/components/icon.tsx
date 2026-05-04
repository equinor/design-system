import { basicIcon, iconWithColor } from "@/codeSnippets/icon";
import { useCodeSnippet } from "@/hooks/useCodeSnippet";
import { Icon, Typography } from "@equinor/eds-mobile-components";
import { ScrollView, StyleSheet, View } from "react-native";

export default function IconScreen() {
    const { ViewCode, CodeSnippetDialog } = useCodeSnippet();

    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            <View style={styles.section}>
                <Typography>
                    Icons provide visual cues that help users understand actions
                    and content. They use Material Design Community icons and
                    can be sized and coloured as needed.
                </Typography>
            </View>

            <View style={styles.section}>
                <Typography.Header size="lg">Icon Sizes</Typography.Header>

                <View style={styles.row}>
                    <View style={styles.iconItem}>
                        <Icon name="heart" size={16} />
                        <Typography>16px</Typography>
                    </View>

                    <View style={styles.iconItem}>
                        <Icon name="heart" size={24} />
                        <Typography>24px (default)</Typography>
                    </View>

                    <View style={styles.iconItem}>
                        <Icon name="heart" size={32} />
                        <Typography>32px</Typography>
                    </View>

                    <View style={styles.iconItem}>
                        <Icon name="heart" size={48} />
                        <Typography>48px</Typography>
                    </View>
                </View>

                <ViewCode title="Basic Icon" code={basicIcon} />
            </View>

            <View style={styles.section}>
                <Typography.Header size="lg">Common Icons</Typography.Header>

                <View style={styles.iconGrid}>
                    <View style={styles.iconItem}>
                        <Icon name="home" size={32} />
                        <Typography>home</Typography>
                    </View>

                    <View style={styles.iconItem}>
                        <Icon name="cog" size={32} />
                        <Typography>cog</Typography>
                    </View>

                    <View style={styles.iconItem}>
                        <Icon name="account" size={32} />
                        <Typography>account</Typography>
                    </View>

                    <View style={styles.iconItem}>
                        <Icon name="magnify" size={32} />
                        <Typography>magnify</Typography>
                    </View>

                    <View style={styles.iconItem}>
                        <Icon name="bell" size={32} />
                        <Typography>bell</Typography>
                    </View>

                    <View style={styles.iconItem}>
                        <Icon name="email" size={32} />
                        <Typography>email</Typography>
                    </View>

                    <View style={styles.iconItem}>
                        <Icon name="heart" size={32} />
                        <Typography>heart</Typography>
                    </View>

                    <View style={styles.iconItem}>
                        <Icon name="star" size={32} />
                        <Typography>star</Typography>
                    </View>

                    <View style={styles.iconItem}>
                        <Icon name="plus" size={32} />
                        <Typography>plus</Typography>
                    </View>

                    <View style={styles.iconItem}>
                        <Icon name="close" size={32} />
                        <Typography>close</Typography>
                    </View>

                    <View style={styles.iconItem}>
                        <Icon name="delete" size={32} />
                        <Typography>delete</Typography>
                    </View>

                    <View style={styles.iconItem}>
                        <Icon name="pencil" size={32} />
                        <Typography>pencil</Typography>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Typography.Header size="lg">Icon with Colors</Typography.Header>

                <View style={styles.row}>
                    <View style={styles.iconItem}>
                        <Icon name="heart" size={32} color="#FF0000" />
                        <Typography>Red</Typography>
                    </View>

                    <View style={styles.iconItem}>
                        <Icon name="heart" size={32} color="#00FF00" />
                        <Typography>Green</Typography>
                    </View>

                    <View style={styles.iconItem}>
                        <Icon name="heart" size={32} color="#0000FF" />
                        <Typography>Blue</Typography>
                    </View>

                    <View style={styles.iconItem}>
                        <Icon name="heart" size={32} color="#FFD700" />
                        <Typography>Gold</Typography>
                    </View>
                </View>

                <ViewCode title="Icon with Color" code={iconWithColor} />
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
    row: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 24,
    },
    iconGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 20,
    },
    iconItem: {
        alignItems: "center",
        gap: 8,
        minWidth: 80,
    },
});
