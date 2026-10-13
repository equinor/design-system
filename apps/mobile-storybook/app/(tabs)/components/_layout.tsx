import { SettingsControls } from "@/components/SettingsControls";
import { getComponentTitle } from "@/lib/registry";
import { useToken } from "@equinor/eds-mobile-components";
import { Stack } from "expo-router";

export default function ComponentsLayout() {
    const token = useToken();

    return (
        <Stack
            screenOptions={({ route }) => ({
                // Titles come from the registry, so a screen is titled as
                // soon as it is registered.
                title:
                    route.name === "index"
                        ? "Components"
                        : getComponentTitle(route.name),
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
            })}
        />
    );
}
