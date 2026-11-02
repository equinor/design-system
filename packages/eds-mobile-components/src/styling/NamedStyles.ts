import type { ImageStyle, TextStyle, ViewStyle } from "react-native";

/**
 * A style sheet object keyed by style name. React Native removed
 * `StyleSheet.NamedStyles` in 0.88, so this keeps its previous definition.
 */
export type NamedStyles<T> = {
    [P in keyof T]: ViewStyle | TextStyle | ImageStyle;
};
