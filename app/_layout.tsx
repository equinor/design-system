import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import "react-native-gesture-handler";

import { EDSProvider, useEDS } from "@equinor/eds-mobile-components";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function AppContent() {
    const [loaded] = useEDS();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        async function prepare() {
            try {
                // Wait for fonts to load
                if (loaded) {
                    // Add a delay to ensure fonts are registered in React Native
                    await new Promise((resolve) => setTimeout(resolve, 500));
                    setIsReady(true);
                }
            } catch (e) {
                console.warn(e);
            } finally {
                // Hide the splash screen
                if (loaded) {
                    await SplashScreen.hideAsync();
                }
            }
        }

        prepare();
    }, [loaded]);

    if (!isReady) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
        </>
    );
}

export default function RootLayout() {
    return (
        <EDSProvider density="phone" colorScheme="light">
            <AppContent />
        </EDSProvider>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
});
