import { Button, Typography } from "@equinor/eds-mobile-components";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function CellDetailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{
        title?: string;
        description?: string;
    }>();

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Typography variant="h5" style={styles.title}>
                    {params.title || "Detail Screen"}
                </Typography>
                <View style={{ height: 16 }} />

                {params.description && (
                    <>
                        <Typography variant="p" style={styles.description}>
                            {params.description}
                        </Typography>
                        <View style={{ height: 24 }} />
                    </>
                )}

                <Typography variant="p">
                    This is a detail screen that shows when you tap a navigation
                    cell.
                </Typography>
                <View style={{ height: 32 }} />
                <Button label="Go Back" onPress={() => router.back()} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    content: {
        padding: 16,
    },
    title: {
        fontWeight: "bold",
    },
    description: {
        opacity: 0.7,
    },
    button: {
        backgroundColor: "#007AFF",
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
    },
});
