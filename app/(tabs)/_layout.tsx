import { Icon, IconProps, useToken } from "@equinor/eds-mobile-components";
import { Tabs } from "expo-router";

export default function TabLayout() {
    const { newColors, newTypography } = useToken();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: newColors.bg.accent.fillEmphasis.active,
                tabBarInactiveTintColor: newColors.text.neutral.subtle,
                tabBarLabelStyle: {
                    fontSize: newTypography.ui.fontFamilySize.sm.fontSize,
                },
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <Icon
                            name="home-variant"
                            size={size}
                            color={color as IconProps["color"]}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="components"
                options={{
                    title: "Components",
                    tabBarIcon: ({ color, size }) => (
                        <Icon
                            name="puzzle"
                            size={size}
                            color={color as IconProps["color"]}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
