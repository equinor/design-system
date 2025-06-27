import { StyleSheet } from "react-native";

import type { ThemeDependentStyles } from "../styling";
import { useDynamicStyleSheet } from "./useDynamicStyleSheet";
import { useToken } from "./useToken";

type InferStyles<T> = T extends ThemeDependentStyles<never, infer R> ? R : never;

/**
 * Processes a style sheet created with `EDSStyleSheet.create` to provide a resolved style you can use in your component.
 * @param themeStyles The style sheet object created by the `EDSStyleSheet.create` method
 * @returns A resolved style sheet object that adheres to the current app theme.
 */
export function useStyles<
    TName extends StyleSheet.NamedStyles<TName> | StyleSheet.NamedStyles<unknown>,
>(themeStyles: ThemeDependentStyles<undefined, TName>): InferStyles<typeof themeStyles>;
export function useStyles<
    TName extends StyleSheet.NamedStyles<TName> | StyleSheet.NamedStyles<unknown>,
    TProps,
>(themeStyles: ThemeDependentStyles<TProps, TName>, props: TProps): InferStyles<typeof themeStyles>;
export function useStyles<
    TName extends StyleSheet.NamedStyles<TName> | StyleSheet.NamedStyles<unknown>,
    TProps,
>(themeStyles: ThemeDependentStyles<TProps, TName>, props?: TProps) {
    const currentTheme = useToken();
    return useDynamicStyleSheet<TName>(
        () => themeStyles(currentTheme, props as TProps),
        [currentTheme, props],
    );
}
