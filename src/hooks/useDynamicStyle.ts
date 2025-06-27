import { useMemo, useState, DependencyList } from "react";
import { ImageStyle, TextStyle, ViewStyle, StyleSheet } from "react-native";

const createStyleSheet = (style: ViewStyle | ImageStyle | TextStyle) =>
    StyleSheet.create({ __main: style }).__main;

/**
 * Memoizes a provided style to its dependencies. Internally, this hook creates a new StyleSheet object on recalculation.
 * @param style The style to memoize.
 * @param dependencies Dependency array for when to recalculate the style.
 * @returns A memoized style object.
 */
export const useDynamicStyle = (
    style: () => ViewStyle | ImageStyle | TextStyle,
    dependencies: DependencyList,
) => {
    const [currentStyle, setCurrentStyle] = useState(style());
    useMemo(() => {
        const newStyle = createStyleSheet(style());
        setCurrentStyle(newStyle);
        // eslint-disable-next-line react-hooks/exhaustive-deps -- we only want to update when deps change
    }, dependencies);
    return currentStyle;
};
