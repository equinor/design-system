import { Typography, useToken } from "@equinor/eds-mobile-components";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Image, StyleSheet, View } from "react-native";

export default function HomeScreen() {
    const { newColors, newSpacing } = useToken();
    const tabBarHeight = useBottomTabBarHeight();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: newSpacing.spacing.horizontal.threeXl,
            paddingTop: newSpacing.spacing.vertical.threeXl,
            paddingBottom: tabBarHeight,
            gap: newSpacing.spacing.vertical.lg,
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
                    color: newColors.text.neutral.subtle,
                }}
            >
                Equinor Design System for React Native
            </Typography>
        </View>
    );
}
