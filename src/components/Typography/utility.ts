import { TypographySizeToken } from "../../styling/tokens";
import { TypographyStyleProps } from "./types";

type PropTokenFieldMap = {
    [P in keyof TypographyStyleProps]: Record<
        TypographyStyleProps[P],
        keyof TypographySizeToken
    >;
};

export const PROP_TOKEN_FIELD_MAP = {
    weight: {
        bolder: "fontWeightBolder",
        lighter: "fontWeightLighter",
        normal: "fontWeightNormal",
    },
    lineHeight: {
        default: "lineHeightDefault",
        squished: "lineHeightSquished",
    },
    tracking: {
        normal: "trackingNormal",
        tight: "trackingTight",
        wide: "trackingWide",
    },
} as const satisfies PropTokenFieldMap;
