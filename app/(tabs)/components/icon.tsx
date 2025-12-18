import { basicIcon, iconWithColor } from "@/codeSnippets/icon";
import { useCodeSnippet } from "@/hooks/useCodeSnippet";
import { Icon, Typography } from "@equinor/eds-mobile-components";
import { ScrollView, StyleSheet, View } from "react-native";

export default function IconScreen() {
    const { ViewCode, CodeSnippetDialog } = useCodeSnippet();

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Typography variant="h5">Icons</Typography>
                <Typography variant="p">
                    Icons provide visual cues that help users understand actions
                    and content. They use Material Design Community icons and
                    can be sized and coloured as needed.
                </Typography>
            </View>

            <View style={styles.section}>
                <Typography variant="h6">Icon Sizes</Typography>

                <View style={styles.row}>
                    <View style={styles.iconItem}>
                        <Icon name="heart" size={16} />
                        <Typography variant="p">16px</Typography>
                    </View>

                    <View style={styles.iconItem}>
                        <Icon name="heart" size={24} />
                        <Typography variant="p">24px (default)</Typography>
                    </View>

                    <View style={styles.iconItem}>
                        <Icon name="heart" size={32} />
                        <Typography variant="p">32px</Typography>
                    </View>

                    <View style={styles.iconItem}>
                        <Icon name="heart" size={48} />
                        <Typography variant="p">48px</Typography>
                    </View>
                </View>

                <ViewCode title="Basic Icon" code={basicIcon} />
            </View>

            <View style={styles.section}>
                <Typography variant="h6">Common Icons</Typography>

                <View style={styles.iconGrid}>
                    <View style={styles.iconItem}>
                        <Icon name="home" size={32} />
                        <Typography variant="p">home</Typography>
                    </View>

                    <View style={styles.iconItem}>
                        <Icon name="cog" size={32} />
                        <Typography variant="p">cog</Typography>
                    </View>

                    <View style={styles.iconItem}>
                        <Icon name="account" size={32} />
                        <Typography variant="p">account</Typography>
                    </View>

                    <View style={styles.iconItem}>
                        <Icon name="magnify" size={32} />
                        <Typography variant="p">magnify</Typography>
                    </View>

                    <View style={styles.iconItem}>
                        <Icon name="bell" size={32} />
                        <Typography variant="p">bell</Typography>
                    </View>

                    <View style={styles.iconItem}>
                        <Icon name="email" size={32} />
                        <Typography variant="p">email</Typography>
                    </View>

                    <View style={styles.iconItem}>
                        <Icon name="heart" size={32} />
                        <Typography variant="p">heart</Typography>
                    </View>

                    <View style={styles.iconItem}>
                        <Icon name="star" size={32} />
                        <Typography variant="p">star</Typography>
                    </View>

                    <View style={styles.iconItem}>
                        <Icon name="plus" size={32} />
                        <Typography variant="p">plus</Typography>
                    </View>

                    <View style={styles.iconItem}>
                        <Icon name="close" size={32} />
                        <Typography variant="p">close</Typography>
                    </View>

                    <View style={styles.iconItem}>
                        <Icon name="delete" size={32} />
                        <Typography variant="p">delete</Typography>
                    </View>

                    <View style={styles.iconItem}>
                        <Icon name="pencil" size={32} />
                        <Typography variant="p">pencil</Typography>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Typography variant="h6">Icon with Colors</Typography>

                <View style={styles.row}>
                    <View style={styles.iconItem}>
                        <Icon name="heart" size={32} color="#FF0000" />
                        <Typography variant="p">Red</Typography>
                    </View>

                    <View style={styles.iconItem}>
                        <Icon name="heart" size={32} color="#00FF00" />
                        <Typography variant="p">Green</Typography>
                    </View>

                    <View style={styles.iconItem}>
                        <Icon name="heart" size={32} color="#0000FF" />
                        <Typography variant="p">Blue</Typography>
                    </View>

                    <View style={styles.iconItem}>
                        <Icon name="heart" size={32} color="#FFD700" />
                        <Typography variant="p">Gold</Typography>
                    </View>
                </View>

                <ViewCode title="Icon with Color" code={iconWithColor} />
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
