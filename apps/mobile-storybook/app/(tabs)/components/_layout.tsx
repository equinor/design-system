import { SettingsControls } from "@/components/SettingsControls";
import { useToken } from "@equinor/eds-mobile-components";
import { Stack } from "expo-router";

export default function ComponentsLayout() {
    const token = useToken();

    return (
        <Stack
            screenOptions={{
                headerTransparent: true,
                headerBlurEffect: "none",
                headerLargeTitle: true,
                headerLargeTitleShadowVisible: true,
                headerLargeTitleStyle: {
                    fontFamily: "Equinor-Bold",
                    color: token.colors.text.neutral.strong,
                },
                headerTitleStyle: {
                    fontFamily: "Equinor-Bold",
                    color: token.colors.text.neutral.strong,
                },
                headerRight: () => <SettingsControls />,
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: "Components",
                }}
            />
            <Stack.Screen name="badge" options={{ title: "Badge" }} />
            <Stack.Screen name="button" options={{ title: "Button" }} />
            <Stack.Screen name="divider" options={{ title: "Divider" }} />
            <Stack.Screen name="input" options={{ title: "Input" }} />
            <Stack.Screen name="link" options={{ title: "Link" }} />
            <Stack.Screen
                name="selectioncontrols"
                options={{ title: "Selection Controls" }}
            />
            <Stack.Screen
                name="typography"
                options={{ title: "Typography" }}
            />
            <Stack.Screen
                name="textfield"
                options={{ title: "TextField" }}
            />
            <Stack.Screen name="search" options={{ title: "Search" }} />
        </Stack>
    );
}
