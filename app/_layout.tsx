import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import "react-native-gesture-handler";

import { useAppStore } from "@/lib/store";
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
                    background: token.newColors.bg.neutral.canvas,
                    primary: token.newColors.bg.accent.fillEmphasis.default,
                    text: token.newColors.text.neutral.strong,
                    border: token.newColors.border.neutral.medium,
                    notification: token.newColors.bg.accent.fillEmphasis.active,
                    card: token.newColors.bg.neutral.surface,
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
    const systemScheme = useColorScheme();
    const userScheme = useAppStore((state) => state.scheme);
    const density = useAppStore((state) => state.density);

    useEffect(() => {
        if (!loaded) return;

        SplashScreen.hideAsync();
    }, [loaded]);

    if (!loaded) return null;

    return (
        <EDSProvider
            density={density}
            colorScheme={userScheme ?? systemScheme ?? "light"}
        >
            <AppContent />
        </EDSProvider>
    );
}
