import { Link, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

import { Typography } from "@equinor/eds-mobile-components";

export default function NotFoundScreen() {
    return (
        <>
            <Stack.Screen options={{ title: "Oops!" }} />
            <View style={styles.container}>
                <Typography.Header size="lg">
                    This screen does not exist.
                </Typography.Header>
                <Link href="/" style={styles.link}>
                    <Typography style={{ textDecorationLine: "underline" }}>
                        Go to home screen!
                    </Typography>
                </Link>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
});
