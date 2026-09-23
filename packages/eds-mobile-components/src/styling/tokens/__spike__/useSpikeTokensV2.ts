import { useContext, useMemo } from "react";
import { EDSContext } from "../../../components/EDSProvider/EDSContext";
import { theme as darkComfortable } from "./theme.dark.comfortable.V2";
import { theme as lightComfortable } from "./theme.light.comfortable.V2";
import { theme as lightCompact } from "./theme.light.compact.V2";

/**
 * Spike-only replacement for `useToken`, backed by the *V2* Tokens Studio
 * TypeScript export (hsl colours, plain-number dimensions) instead of the
 * V1 export `useSpikeTokens` reads.
 *
 * No `toReactNative` conversion step is needed here: V2 already emits plain
 * numbers for every dimension and `hsl(...)` strings for every colour, both
 * of which React Native reads natively. See the V1 vs V2 comparison on
 * equinor/design-system#5464.
 *
 * Density mapping is unchanged from the V1 hook (see equinor/design-system#5464):
 *
 *   mobile "comfortable"  ->  new "compact"      9 of 10 steps identical
 *   mobile "spacious"     ->  new "comfortable"  all 10 steps identical
 *
 * Dark mode only exists at one density here because only three V2 exports
 * were downloaded, so dark always resolves to the comfortable file.
 */
// Each theme file has the same key structure but different literal hsl/number
// values (`as const`), so a plain `typeof lightComfortable` return type rejects
// the other two themes as not-assignable. Widen leaf literal types to `string`
// / `number` while keeping the object shape, so any of the three themes satisfies it.
type Widen<T> = T extends string
    ? string
    : T extends number
      ? number
      : T extends readonly (infer U)[]
        ? readonly Widen<U>[]
        : T extends object
          ? { [K in keyof T]: Widen<T[K]> }
          : T;

export type SpikeTokenV2 = Widen<typeof lightComfortable>;

export function useSpikeTokensV2(): SpikeTokenV2 {
    const context = useContext(EDSContext);
    if (!context) {
        throw new Error(
            "useSpikeTokensV2 must be called within an EDSProvider. Did you forget to wrap your application in it?"
        );
    }

    const { colorScheme, density } = context;

    return useMemo(() => {
        if (colorScheme === "dark") return darkComfortable;
        return density === "spacious" ? lightComfortable : lightCompact;
    }, [colorScheme, density]);
}
