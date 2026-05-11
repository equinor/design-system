import { SettingsControls } from "@/components/SettingsControls";
import { Stack } from "expo-router";

export default function ComponentsLayout() {
    return (
        <Stack
            screenOptions={{
                headerTransparent: true,
                headerBlurEffect: "none",
                headerLargeTitle: true,
                headerLargeTitleShadowVisible: true,
                headerLargeTitleStyle: { fontFamily: "Equinor-Bold" },
                headerTitleStyle: {
                    fontFamily: "Equinor-Bold",
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
            <Stack.Screen name="button" options={{ title: "Button" }} />
            <Stack.Screen name="input" options={{ title: "Input" }} />
            <Stack.Screen
                name="selectioncontrols"
                options={{ title: "Selection Controls" }}
            />
            <Stack.Screen
                name="typography"
                options={{ title: "Typography" }}
            />
        </Stack>
    );
}
