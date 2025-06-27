import { StyleSheet } from "react-native";
import type { Token } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- other typings seem to not work
export type ThemeDependentStyles<TProps = undefined, TStyleSheet = StyleSheet.NamedStyles<any>> = (
    /**
     * The will-be resolved theme.
     */
    context: Token,
    /**
     * Additional props passed into the style sheet create object.
     */
    props: TProps,
) => TStyleSheet;

/**
 * Provides functionality for creating resolvable style sheets.
 */
export const EDSStyleSheet = {
    /**
     * Creates a resolvable style sheet object. Use this with the `useStyles` hook to resolve it to a context.
     * @param creator An object containing the will-be resolved theme and possibly any props sent in from the calling component.
     * @returns A resolvable style sheet.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- other typings seem to not work
    create<TProps, TStyleSheet extends StyleSheet.NamedStyles<any>>(
        creator: ThemeDependentStyles<TProps, TStyleSheet>,
    ) {
        return creator;
    },
};
