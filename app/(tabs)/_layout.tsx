import { Icon, IconProps, useToken } from "@equinor/eds-mobile-components";
import { Tabs } from "expo-router";

export default function TabLayout() {
    const { newColors } = useToken();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor:
                    newColors.Bg.Accent["Fill Emphasis"].Active,
                tabBarInactiveTintColor:
                    newColors.Bg.Accent["Fill Muted"].Default,
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <Icon
                            name="home"
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
                            name="view-grid"
                            size={size}
                            color={color as IconProps["color"]}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
