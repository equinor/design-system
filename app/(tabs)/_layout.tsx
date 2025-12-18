import { Icon, IconProps } from "@equinor/eds-mobile-components";
import { Tabs } from "expo-router";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#007079",
                tabBarInactiveTintColor: "#6F6F6F",
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
