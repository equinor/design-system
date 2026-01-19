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
                    background: token.newColors.Bg.Neutral.Canvas,
                    primary: token.newColors.Bg.Accent["Fill Emphasis"].Default,
                    text: token.newColors.Text.Neutral.Strong,
                    border: token.newColors.Border.Neutral.Medium,
                    notification:
                        token.newColors.Bg.Accent["Fill Emphasis"].Active,
                    card: token.newColors.Bg.Neutral.Surface,
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

    useEffect(() => {
        if (!loaded) return;

        SplashScreen.hideAsync();
    }, [loaded]);

    if (!loaded) return null;

    return (
        <EDSProvider
            density="comfortable"
            colorScheme={userScheme ?? systemScheme ?? "light"}
        >
            <AppContent />
        </EDSProvider>
    );
}
