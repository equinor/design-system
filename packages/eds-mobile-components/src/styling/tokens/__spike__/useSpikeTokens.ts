import { useContext, useMemo } from "react";
import { EDSContext } from "../../../components/EDSProvider/EDSContext";
import { toReactNative } from "./convert";
import { theme as darkComfortable } from "./theme.dark.comfortable";
import { theme as lightComfortable } from "./theme.light.comfortable";
import { theme as lightCompact } from "./theme.light.compact";
// theme.light.relaxed is unused now the diagnostic is reverted; kept on disk for reference.

/**
 * Spike-only replacement for `useToken`, backed by the Tokens Studio
 * TypeScript export instead of the generated token modules.
 *
 * Mobile's two densities map onto the new foundation's three as follows, based
 * on comparing the two scales step by step (see equinor/design-system#5464):
 *
 *   mobile "comfortable"  ->  new "compact"      9 of 10 steps identical
 *   mobile "spacious"     ->  new "comfortable"  all 10 steps identical
 *
 * The new "relaxed" density has no mobile equivalent yet, so it is not
 * reachable through `EDSProvider`. Swap `theme.light.relaxed` in below to see
 * it. Dark mode only exists at one density here because only four exports were
 * downloaded, so dark always resolves to the comfortable file.
 */
export type SpikeToken = ReturnType<typeof toReactNative<typeof lightComfortable>>;

export function useSpikeTokens(): SpikeToken {
    const context = useContext(EDSContext);
    if (!context) {
        throw new Error(
            "useSpikeTokens must be called within an EDSProvider. Did you forget to wrap your application in it?"
        );
    }

    const { colorScheme, density } = context;

    return useMemo(() => {
        if (colorScheme === "dark") return toReactNative(darkComfortable);
        return toReactNative(
            density === "spacious" ? lightComfortable : lightCompact
        );
    }, [colorScheme, density]);
}
