import { Icon, IconProps, useToken } from "@equinor/eds-mobile-components";
import { Tabs } from "expo-router";

export default function TabLayout() {
    const { colors, typography } = useToken();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: colors.text.accent.subtle,
                tabBarInactiveTintColor: colors.border.neutral.medium,
                tabBarLabelStyle: {
                    fontSize: typography.ui.fontFamilySize.sm.fontSize,
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
            <Tabs.Screen
                name="about"
                options={{
                    title: "About",
                    tabBarIcon: ({ color, size }) => (
                        <Icon
                            name="information"
                            size={size}
                            color={color as IconProps["color"]}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
