import { useAppStore } from "@/lib/store";
import { Button } from "@equinor/eds-mobile-components";
import { useColorScheme } from "react-native";

export const ColorSchemeButton = () => {
    const systemScheme = useColorScheme();
    const userScheme = useAppStore((state) => state.scheme);
    const scheme = userScheme ?? systemScheme;

    const setScheme = useAppStore((state) => state.setScheme);

    return (
        <Button.Icon
            variant="ghost"
            round
            name={scheme === "light" ? "weather-sunny" : "moon-waning-crescent"}
            onPress={() => setScheme(scheme === "dark" ? "light" : "dark")}
        />
    );
};
