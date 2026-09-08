import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import "react-native-gesture-handler";

import { useAppStore } from "@/lib/store";
import { useUserScheme } from "@/lib/useUserScheme";
import { EDSProvider, useEDS, useToken } from "@equinor/eds-mobile-components";
import { ThemeProvider } from "@react-navigation/native";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

function AppContent() {
    const token = useToken();
    return (
        <ThemeProvider
            value={{
                fonts: {
                    bold: {
                        fontFamily: "Equinor-Bold",
                        fontWeight: "bold",
                    },
                    heavy: {
                        fontFamily: "Equinor-Medium",
                        fontWeight: "900",
                    },
                    medium: {
                        fontFamily: "Equinor-Medium",
                        fontWeight: "500",
                    },
                    regular: {
                        fontFamily: "Equinor-Medium",
                        fontWeight: "normal",
                    },
                },
                dark: false,
                colors: {
                    background: token.colors.bg.neutral.canvas,
                    primary: token.colors.bg.accent.fillEmphasis.default,
                    text: token.colors.text.neutral.strong,
                    border: token.colors.border.neutral.medium,
                    notification: token.colors.bg.accent.fillEmphasis.active,
                    card: token.colors.bg.neutral.surface,
                },
            }}
        >
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
        </ThemeProvider>
    );
}

export default function RootLayout() {
    const [loaded] = useEDS();
    const resolvedScheme = useUserScheme();
    const density = useAppStore((state) => state.density);

    useEffect(() => {
        if (!loaded) return;

        SplashScreen.hideAsync();
    }, [loaded]);

    if (!loaded) return null;

    return (
        <EDSProvider
            density={density}
            colorScheme={resolvedScheme}
        >
            <AppContent />
        </EDSProvider>
    );
}
