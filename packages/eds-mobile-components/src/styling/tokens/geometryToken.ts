import type { Elevation, ShadowStyle } from "../types";

export type GeometryToken = {
    border: {
        elementBorderRadius: number;
        containerBorderRadius: number;
        borderWidth: number;
        focusedBorderWidth: number;
        tabsBorderWidth: number;
    };
    dimension: {
        icon: { size: number };
        button: { minHeight: number };
        cell: {
            minHeight: number;
            navigation: { height: number };
            accordion: { height: number };
            adornment: { widthSmall: number; widthMedium: number; widthLarge: number };
        };
        dialog: {
            minHeight: number;
            defaultWidth: number;
            header: { height: number };
        };
        tabs: { minWidth: number };
    };
    shadow: Record<Elevation, ShadowStyle>;
};

// Static geometry values — density variants flattened to comfortable defaults.
// TODO: replace with @equinor/eds-tokens geometry/dimension/shadow tokens once available.
export const geometryToken: GeometryToken = {
    border: {
        elementBorderRadius: 4,
        containerBorderRadius: 24,
        borderWidth: 1,
        focusedBorderWidth: 2,
        tabsBorderWidth: 2,
    },
    dimension: {
        icon: { size: 22 },
        button: { minHeight: 40 },
        cell: {
            minHeight: 30,
            navigation: { height: 60 },
            accordion: { height: 32 },
            adornment: { widthSmall: 32, widthMedium: 48, widthLarge: 88 },
        },
        dialog: { minHeight: 213, defaultWidth: 500, header: { height: 50 } },
        tabs: { minWidth: 32 },
    },
    shadow: {
        none: {},
        raised: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.23, shadowRadius: 2.62, elevation: 4 },
        overlay: { shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.29, shadowRadius: 4.65, elevation: 7 },
        sticky: { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.32, shadowRadius: 5.46, elevation: 9 },
        temporaryNav: { shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.37, shadowRadius: 7.49, elevation: 12 },
        aboveScrim: { shadowColor: "#000", shadowOffset: { width: 0, height: 9 }, shadowOpacity: 0.5, shadowRadius: 12.35, elevation: 19 },
    },
};
