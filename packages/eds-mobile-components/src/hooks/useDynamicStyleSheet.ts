import { DependencyList, useMemo } from "react";
import { StyleSheet } from "react-native";
import type { NamedStyles } from "../styling/NamedStyles";

const createStyleSheet = <
    T extends NamedStyles<T> | NamedStyles<unknown>,
>(
    styles: T | NamedStyles<T>
) => StyleSheet.create(styles);

/**
 * Memoizes a provided style sheet object to its dependencies. Internally, this hook creates a new StyleSheet using StyleSheet.create on recalculation.
 * @param style The style sheet to memoize.
 * @param dependencies Dependency array for when to recalculate the style sheet.
 * @returns A memoized style sheet object.
 */
export const useDynamicStyleSheet = <
    T extends NamedStyles<T> | NamedStyles<unknown>,
>(
    style: () => T | NamedStyles<T>,
    dependencies: DependencyList
) => {
    return useMemo(() => createStyleSheet(style()), dependencies);
};
