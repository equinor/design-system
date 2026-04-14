import { ColorSchemeButton } from "@/components/ColorSchemeButton";
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
                headerRight: () => <ColorSchemeButton />,
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: "Components",
                }}
            />
            <Stack.Screen name="accordion" options={{ title: "Accordion" }} />
            <Stack.Screen
                name="autocomplete"
                options={{ title: "Autocomplete" }}
            />
            <Stack.Screen name="button" options={{ title: "Button" }} />
            <Stack.Screen name="cell" options={{ title: "Cell" }} />
            <Stack.Screen name="cell-detail" options={{ title: "Detail" }} />
            <Stack.Screen name="chips" options={{ title: "Chips" }} />
            <Stack.Screen name="dialogs" options={{ title: "Dialog" }} />
            <Stack.Screen
                name="environment"
                options={{ title: "Environment" }}
            />
            <Stack.Screen name="icon" options={{ title: "Icon" }} />
            <Stack.Screen name="input" options={{ title: "Input" }} />
            <Stack.Screen name="label" options={{ title: "Label" }} />
            <Stack.Screen name="menu" options={{ title: "Menu" }} />
            <Stack.Screen
                name="offlinebanner"
                options={{ title: "Offline Banner" }}
            />
            <Stack.Screen name="paper" options={{ title: "Paper" }} />
            <Stack.Screen name="popover" options={{ title: "Popover" }} />
            <Stack.Screen name="progress" options={{ title: "Progress" }} />
            <Stack.Screen
                name="progressindicator"
                options={{ title: "Progress Indicator" }}
            />
            <Stack.Screen name="scrim" options={{ title: "Scrim" }} />
            <Stack.Screen name="search" options={{ title: "Search" }} />
            <Stack.Screen name="select" options={{ title: "Select" }} />
            <Stack.Screen
                name="selectioncontrols"
                options={{ title: "Selection Controls" }}
            />
            <Stack.Screen name="spacer" options={{ title: "Spacer" }} />
            <Stack.Screen name="tabs" options={{ title: "Tabs" }} />
            <Stack.Screen name="textfield" options={{ title: "TextField" }} />
            <Stack.Screen
                name="typography"
                options={{ title: "Typography" }}
            />
        </Stack>
    );
}
