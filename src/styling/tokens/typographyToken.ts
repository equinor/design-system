import { typography as header } from "@equinor/eds-tokens/ts/typography/font-family-header";
import { typography as ui } from "@equinor/eds-tokens/ts/typography/font-family-ui";

/**
 * These tokens are one semantic level below the header and ui tokens, so we omit exposing them for now to avoid token api bloat.
 */

// import { typography as sizeTwoXl } from "@equinor/eds-tokens/ts/typography/font-size-2xl";
// import { typography as sizeThreeXl } from "@equinor/eds-tokens/ts/typography/font-size-3xl";
// import { typography as sizeFourXl } from "@equinor/eds-tokens/ts/typography/font-size-4xl";
// import { typography as sizeFiveXl } from "@equinor/eds-tokens/ts/typography/font-size-5xl";
// import { typography as sizeSixXl } from "@equinor/eds-tokens/ts/typography/font-size-6xl";
// import { typography as sizeLg } from "@equinor/eds-tokens/ts/typography/font-size-lg";
// import { typography as sizeMd } from "@equinor/eds-tokens/ts/typography/font-size-md";
// import { typography as sizeSm } from "@equinor/eds-tokens/ts/typography/font-size-sm";
// import { typography as sizeXl } from "@equinor/eds-tokens/ts/typography/font-size-xl";
// import { typography as sizeXs } from "@equinor/eds-tokens/ts/typography/font-size-xs";
// import { typography as bolder } from "@equinor/eds-tokens/ts/typography/font-weight-bolder";
// import { typography as lighter } from "@equinor/eds-tokens/ts/typography/font-weight-lighter";
// import { typography as weightNormal } from "@equinor/eds-tokens/ts/typography/font-weight-normal";
// import { typography as lineHeightDefault } from "@equinor/eds-tokens/ts/typography/line-height-default";
// import { typography as lineHeightSquished } from "@equinor/eds-tokens/ts/typography/line-height-squished";
// import { typography as trackingLoose } from "@equinor/eds-tokens/ts/typography/tracking-loose";
// import { typography as trackingNormal } from "@equinor/eds-tokens/ts/typography/tracking-normal";
// import { typography as trackingTight } from "@equinor/eds-tokens/ts/typography/tracking-tight";
// import { typography as trackingWide } from "@equinor/eds-tokens/ts/typography/tracking-wide";

export const typographyToken = {
    header,
    ui,
} as const;

export type TypographyToken = typeof typographyToken;

export type TypographySizeToken =
    TypographyToken[keyof TypographyToken]["fontFamilySize"][keyof TypographyToken[keyof TypographyToken]["fontFamilySize"]];
