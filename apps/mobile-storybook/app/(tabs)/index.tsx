import { Typography, useToken } from "@equinor/eds-mobile-components";
import { Image, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
    const { colors, spacing } = useToken();
    const { bottom: bottomInset } = useSafeAreaInsets();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: spacing.spacing.horizontal.threeXl,
            paddingTop: spacing.spacing.vertical.threeXl,
            paddingBottom: bottomInset,
            gap: spacing.spacing.vertical.lg,
        },
        logo: {
            width: 240,
            height: 240,
            resizeMode: "contain",
        },
    });

    return (
        <View style={styles.container}>
            <Typography.Header size="fiveXl" weight="normal">
                EDS Mobile
            </Typography.Header>
            <Image
                source={require("../../assets/images/puzzle_illu.png")}
                style={styles.logo}
            />
            <Typography
                style={{
                    textAlign: "center",
                    color: colors.text.neutral.subtle,
                }}
            >
                Equinor Design System for React Native
            </Typography>
        </View>
    );
}
