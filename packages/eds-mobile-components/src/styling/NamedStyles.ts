import type { ImageStyle, TextStyle, ViewStyle } from "react-native";

/**
 * A style sheet object keyed by style name. React Native removed
 * `StyleSheet.NamedStyles` in 0.88, so this is a local type of the same shape:
 * a record of view, text and image styles.
 */
export type NamedStyles<T> = {
    [P in keyof T]: ViewStyle | TextStyle | ImageStyle;
};
