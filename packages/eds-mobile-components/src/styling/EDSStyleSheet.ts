import type { NamedStyles } from "./NamedStyles";
import type { MasterToken } from "./tokens";

export type ThemeDependentStyles<
    TProps = undefined,
    TStyleSheet = NamedStyles<unknown>,
> = (
    /**
     * The will-be resolved token.
     */
    token: MasterToken,
    /**
     * Additional props passed into the style sheet create object.
     */
    props: TProps
) => TStyleSheet;

/**
 * Provides functionality for creating resolvable style sheets.
 */
export const EDSStyleSheet = {
    /**
     * Creates a resolvable style sheet object. Use this with the `useStyles` hook to resolve it to a context.
     * @param creator An object containing the will-be resolved token and possibly any props sent in from the calling component.
     * @returns A resolvable style sheet.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- other typings seem to not work
    create<TProps, TStyleSheet extends NamedStyles<any>>(
        creator: ThemeDependentStyles<TProps, TStyleSheet>
    ) {
        return creator;
    },
};
