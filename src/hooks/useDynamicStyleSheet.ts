import { useMemo, DependencyList } from "react";
import { StyleSheet } from "react-native";

const createStyleSheet = <T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<unknown>>(
    styles: T | StyleSheet.NamedStyles<T>,
) => StyleSheet.create(styles);

/**
 * Memoizes a provided style sheet object to its dependencies. Internally, this hook creates a new StyleSheet using StyleSheet.create on recalculation.
 * @param style The style sheet to memoize.
 * @param dependencies Dependency array for when to recalculate the style sheet.
 * @returns A memoized style sheet object.
 */
export const useDynamicStyleSheet = <
    T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<unknown>,
>(
    style: () => T | StyleSheet.NamedStyles<T>,
    dependencies: DependencyList,
) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps -- we only want to update when deps change
    return useMemo(() => createStyleSheet(style()), dependencies);
};
