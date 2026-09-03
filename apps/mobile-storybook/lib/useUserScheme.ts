import { useColorScheme } from "react-native";
import { useAppStore } from "./store";

/**
 * Returns the active colour scheme, resolving the user's explicit preference
 * against the system setting. Falls back to "light" if neither is set.
 */
export function useUserScheme(): "light" | "dark" {
    const systemScheme = useColorScheme();
    const userScheme = useAppStore((state) => state.scheme);
    return userScheme ?? (systemScheme === "dark" ? "dark" : "light");
}
