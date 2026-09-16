/**
 * Throwaway helpers for the Tokens Studio TypeScript export spike.
 *
 * The export is nested, camelCased and split per colour scheme, which suits us.
 * Its values are written for CSS rather than React Native:
 *
 *   - every dimension is a string like "16px"; RN needs a plain number
 *   - colours come out as "color(srgb 0.9737 0.9737 0.9737)", which RN cannot
 *     parse at all, and some channels fall outside 0-1 because the source
 *     colours are authored in oklch and sit outside sRGB
 *
 * Both conversions are work the platform should arguably do itself. See the
 * findings on equinor/design-system#5464.
 *
 * Delete this directory once we know whether the export is viable.
 */

/**
 * Preserves the tree's shape, turning only px-valued leaves into numbers.
 *
 * The naive version of this widens every leaf to `string | number`, which then
 * fails against React Native's style types because `backgroundColor` accepts
 * `ColorValue` and not a number. Matching on the `${number}px` template is a
 * workaround for the export not distinguishing colour tokens from dimension
 * tokens in its types, even though DTCG carries `$type` for that purpose.
 * It only works because the export emits `as const`, preserving the literals.
 */
type Converted<T> = {
    [K in keyof T]: T[K] extends `${number}px`
        ? number
        : T[K] extends string
          ? string
          : Converted<T[K]>;
};

// Matches a value that is *only* a px dimension. Deliberately does not match
// composite values such as the elevation shadows, which RN cannot consume as a
// string at all and which this spike leaves alone.
const PX_ONLY = /^(-?\d*\.?\d+)px$/;

// "color(srgb 0.97 0.97 0.97)" or "color(srgb 0.97 0.97 0.97 / 0.5)"
const SRGB = /^color\(srgb\s+(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)(?:\s*\/\s*(-?[\d.]+))?\s*\)$/;

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

const to255 = (channel: number): number => Math.round(channel * 255);

const clamp255 = (channel: number): number =>
    Math.max(0, Math.min(255, to255(channel)));

/** True when any channel sits outside sRGB, so clamping changed the colour. */
const isOutOfGamut = (channels: number[]): boolean =>
    channels.some((channel) => channel < 0 || channel > 1);

/**
 * Converts the export's CSS values into what React Native accepts:
 * "16px" becomes 16, and "color(srgb …)" becomes "rgb(R G B)" with each
 * channel clamped into range.
 *
 * Clamping is a naive per-channel clip, not the chroma-reduction that CSS
 * Color 4 specifies, so clamped colours shift hue rather than just losing
 * saturation. That is deliberate for a spike: we want to see how far off the
 * affected colours look. Use `findOutOfGamut` to list them.
 */
export const toReactNative = <T extends object>(tree: T): Converted<T> => {
    const walk = (value: unknown): unknown => {
        if (typeof value === "string") {
            const px = PX_ONLY.exec(value);
            if (px) return Number(px[1]);

            const srgb = SRGB.exec(value);
            if (srgb) {
                const [r, g, b] = [srgb[1], srgb[2], srgb[3]].map(Number);
                const rgb = `rgb(${clamp255(r)} ${clamp255(g)} ${clamp255(b)})`;
                return srgb[4] === undefined
                    ? rgb
                    : `rgba(${clamp255(r)} ${clamp255(g)} ${clamp255(b)} / ${srgb[4]})`;
            }

            return value;
        }
        if (isRecord(value)) {
            const out: Record<string, unknown> = {};
            for (const [key, child] of Object.entries(value)) {
                out[key] = walk(child);
            }
            return out;
        }
        return value;
    };

    return walk(tree) as Converted<T>;
};

/**
 * Lists every colour that had to be clamped, with its dotted path and how far
 * outside sRGB it was, so the spike can report what mobile renders wrongly.
 */
export const findOutOfGamut = (
    tree: object
): { path: string; value: string; clamped: string }[] => {
    const found: { path: string; value: string; clamped: string }[] = [];

    const walk = (value: unknown, path: string): void => {
        if (typeof value === "string") {
            const srgb = SRGB.exec(value);
            if (!srgb) return;
            const channels = [srgb[1], srgb[2], srgb[3]].map(Number);
            if (isOutOfGamut(channels)) {
                found.push({
                    path,
                    value,
                    clamped: `rgb(${channels.map(clamp255).join(" ")})`,
                });
            }
            return;
        }
        if (isRecord(value)) {
            for (const [key, child] of Object.entries(value)) {
                walk(child, path ? `${path}.${key}` : key);
            }
        }
    };

    walk(tree, "");
    return found;
};
