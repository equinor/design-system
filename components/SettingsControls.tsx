import { useAppStore } from "@/lib/store";
import {
    EDSStyleSheet,
    Icon,
    useStyles,
    useToken,
} from "@equinor/eds-mobile-components";
import { useState } from "react";
import { Pressable, useColorScheme, View } from "react-native";

const ICON_SIZE = 24;
const HIT_PADDING = 6;

export const SettingsControls = () => {
    const styles = useStyles(themeStyles);
    const token = useToken();
    const [open, setOpen] = useState(false);

    const systemScheme = useColorScheme();
    const userScheme = useAppStore((state) => state.scheme);
    const setScheme = useAppStore((state) => state.setScheme);
    const scheme = userScheme ?? systemScheme ?? "light";

    const density = useAppStore((state) => state.density);
    const setDensity = useAppStore((state) => state.setDensity);

    const iconColor =
        scheme === "dark"
            ? token.newColors.text.neutral.strong
            : token.newColors.bg.accent.fillEmphasis.default;

    return (
        <View style={styles.container}>
            {open && (
                <>
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Switch to ${scheme === "dark" ? "light" : "dark"} mode`}
                        hitSlop={2}
                        style={({ pressed }) => [
                            styles.iconButton,
                            pressed && styles.pressed,
                        ]}
                        onPress={() =>
                            setScheme(scheme === "dark" ? "light" : "dark")
                        }
                    >
                        <Icon
                            name={
                                scheme === "light"
                                    ? "weather-sunny"
                                    : "moon-waning-crescent"
                            }
                            size={ICON_SIZE}
                            color={iconColor}
                        />
                    </Pressable>
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Switch to ${density === "spacious" ? "comfortable" : "spacious"} density`}
                        hitSlop={2}
                        style={({ pressed }) => [
                            styles.iconButton,
                            pressed && styles.pressed,
                        ]}
                        onPress={() =>
                            setDensity(
                                density === "spacious"
                                    ? "comfortable"
                                    : "spacious",
                            )
                        }
                    >
                        <Icon
                            name={
                                density === "spacious"
                                    ? "arrow-expand-vertical"
                                    : "arrow-collapse-vertical"
                            }
                            size={ICON_SIZE}
                            color={iconColor}
                        />
                    </Pressable>
                </>
            )}
            <Pressable
                accessibilityRole="button"
                accessibilityLabel={open ? "Close settings" : "Open settings"}
                hitSlop={2}
                style={({ pressed }) => [
                    styles.iconButton,
                    pressed && styles.pressed,
                ]}
                onPress={() => setOpen((prev) => !prev)}
            >
                <Icon name="cog" size={ICON_SIZE} color={iconColor} />
            </Pressable>
        </View>
    );
};

const themeStyles = EDSStyleSheet.create(() => ({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    iconButton: {
        padding: HIT_PADDING,
    },
    pressed: {
        opacity: 0.5,
    },
}));
