import { colors } from "../colors";

import { FONT_BASIS, spacings } from "../values";
import { OldToken } from "./types";

export const layoutToken: OldToken = {
    geometry: {
        border: {
            elementBorderRadius: 4,
            containerBorderRadius: 24,
            borderWidth: 1,
            focusedBorderWidth: 2,
            tabsBorderWidth: 2,
        },
        dimension: {
            icon: {
                size: 22,
            },
            button: {
                minHeight: {
                    spacious: spacings.xx_large,
                    comfortable: spacings.xx_large,
                },
            },
            cell: {
                minHeight: 30,
                navigation: {
                    height: {
                        spacious: 60,
                        comfortable: 60,
                    },
                },
                accordion: {
                    height: {
                        spacious: 40,
                        comfortable: 32,
                    },
                },
                adornment: {
                    widthSmall: {
                        spacious: 40,
                        comfortable: 32,
                    },
                    widthMedium: {
                        spacious: 56,
                        comfortable: 48,
                    },
                    widthLarge: {
                        spacious: 96,
                        comfortable: 88,
                    },
                },
            },
            dialog: {
                minHeight: {
                    spacious: 213,
                    comfortable: 213,
                },
                defaultWidth: {
                    comfortable: 500,
                    spacious: 500,
                },
                header: {
                    height: {
                        spacious: 50,
                        comfortable: 50,
                    },
                },
            },
            tabs: {
                minWidth: {
                    spacious: spacings.xxx_large,
                    comfortable: spacings.x_large,
                },
            },
        },
        shadow: {
            none: {},
            raised: {
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.23,
                shadowRadius: 2.62,
                elevation: 4,
            },
            overlay: {
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 3,
                },
                shadowOpacity: 0.29,
                shadowRadius: 4.65,
                elevation: 7,
            },
            sticky: {
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 4,
                },
                shadowOpacity: 0.32,
                shadowRadius: 5.46,
                elevation: 9,
            },
            temporaryNav: {
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 6,
                },
                shadowOpacity: 0.37,
                shadowRadius: 7.49,
                elevation: 12,
            },
            aboveScrim: {
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 9,
                },
                shadowOpacity: 0.5,
                shadowRadius: 12.35,
                elevation: 19,
            },
        },
    },
    spacing: {
        container: {
            paddingHorizontal: {
                spacious: spacings.x_large,
                comfortable: spacings.large,
            },
            paddingVertical: {
                spacious: spacings.medium,
                comfortable: spacings.medium,
            },
        },
        dialog: {
            padding: {
                spacious: spacings.medium,
                comfortable: spacings.medium,
            },
            gap: {
                spacious: spacings.medium,
                comfortable: spacings.medium,
            },
        },
        element: {
            paddingHorizontal: {
                spacious: spacings.medium_small,
                comfortable: spacings.small,
            },
            paddingVertical: {
                spacious: spacings.small,
                comfortable: spacings.small,
            },
        },
        chip: {
            paddingHorizontal: {
                spacious: spacings.small,
                comfortable: spacings.small,
            },
            paddingVertical: {
                spacious: spacings.x_small,
                comfortable: spacings.x_small,
            },
        },
        button: {
            paddingHorizontal: {
                spacious: spacings.medium,
                comfortable: spacings.medium_small,
            },
            paddingVertical: {
                spacious: spacings.small,
                comfortable: spacings.small,
            },
            iconGap: {
                spacious: spacings.small,
                comfortable: spacings.small,
            },
        },
        textField: {
            paddingHorizontal: {
                spacious: spacings.medium_small,
                comfortable: spacings.small,
            },
            paddingVertical: {
                spacious: spacings.small,
                comfortable: spacings.small,
            },
        },
        menu: {
            paddingVertical: {
                spacious: spacings.small,
                comfortable: spacings.small,
            },
            item: {
                paddingVertical: {
                    spacious: spacings.medium_small,
                    comfortable: spacings.medium_small,
                },
                paddingHorizontal: {
                    spacious: spacings.large,
                    comfortable: spacings.large,
                },
                iconGap: {
                    spacious: spacings.medium,
                    comfortable: spacings.medium_small,
                },
            },
        },
        cell: {
            group: {
                titleBottomPadding: {
                    spacious: spacings.medium_small,
                    comfortable: spacings.small,
                },
            },
            content: {
                titleDescriptionGap: {
                    spacious: spacings.small,
                    comfortable: spacings.small,
                },
            },
            paddingVertical: {
                spacious: spacings.large,
                comfortable: spacings.medium,
            },
            gapHorizontal: {
                spacious: spacings.large,
                comfortable: spacings.medium,
            },
        },
        spacer: {
            small: {
                spacious: 20,
                comfortable: 12,
            },
            medium: {
                spacious: 30,
                comfortable: 22,
            },
            large: {
                spacious: 42,
                comfortable: 34,
            },
        },
        tabs: {
            paddingVertical: {
                spacious: spacings.medium,
                comfortable: spacings.medium,
            },
            paddingHorizontal: {
                spacious: spacings.medium,
                comfortable: spacings.medium,
            },
        },
    },
    typography: {
        paragraph: {
            body_short: {
                fontFamily: "Inter",
                fontSize: FONT_BASIS,
                lineHeight: FONT_BASIS * 1.25,
                textAlign: "left",
            },
            body_long: {
                fontFamily: "Inter",
                fontSize: FONT_BASIS,
                lineHeight: FONT_BASIS * 1.5,
                textAlign: "left",
            },
            overline: {
                fontFamily: "Equinor-Medium",
                fontSize: FONT_BASIS * 0.625,
                lineHeight: FONT_BASIS,
                textAlign: "left",
                textTransform: "uppercase",
            },
            caption: {
                fontFamily: "Inter",
                fontSize: FONT_BASIS * 0.825,
                lineHeight: FONT_BASIS,
                textAlign: "left",
            },
        },
        basic: {
            h1: {
                fontFamily: "Inter",
                fontSize: 2 * FONT_BASIS,
                lineHeight: 2 * FONT_BASIS * 1.25,
                textAlign: "left",
            },
            h2: {
                fontFamily: "Inter",
                fontSize: 1.75 * FONT_BASIS,
                textAlign: "left",
            },
            h3: {
                fontFamily: "Inter",
                fontSize: 1.5 * FONT_BASIS,
                textAlign: "left",
            },
            h4: {
                fontFamily: "Inter",
                fontSize: 1.25 * FONT_BASIS,
                textAlign: "left",
            },
            h5: {
                fontFamily: "Equinor-Medium",
                fontSize: 1.125 * FONT_BASIS,
                textAlign: "left",
            },
            h6: {
                fontFamily: "Equinor-Medium",
                fontSize: FONT_BASIS,
                textAlign: "left",
            },
            p: {
                fontFamily: "Inter",
                fontSize: FONT_BASIS,
                textAlign: "left",
                lineHeight: 1.5 * FONT_BASIS,
            },
            label: {
                fontFamily: "Equinor-Medium",
                fontSize: FONT_BASIS * 0.75,
                textAlign: "left",
                lineHeight: FONT_BASIS,
            },
            input: {
                fontFamily: "Inter",
                fontSize: FONT_BASIS,
                lineHeight: FONT_BASIS,
                textAlign: "left",
            },
        },
        interactive: {
            button: {
                fontFamily: "Equinor-Medium",
                fontSize: 0.875 * FONT_BASIS,
                textAlign: "left",
            },
            link: {
                fontFamily: "Inter",
                lineHeight: 1.5 * FONT_BASIS,
                fontSize: FONT_BASIS,
                color: colors.interactive_primary_light_resting,
                textDecorationLine: "underline",
                textAlign: "left",
            },
        },
        cell: {
            groupTitle: {
                fontFamily: "Inter",
                fontSize: 0.875 * FONT_BASIS,
                textAlign: "left",
                textTransform: "uppercase",
            },
            title: {
                fontFamily: "Inter",
                fontSize: FONT_BASIS,
                textAlign: "left",
            },
            description: {
                fontFamily: "Equinor-Medium",
                fontSize: 0.75 * FONT_BASIS,
                lineHeight: FONT_BASIS,
                textAlign: "left",
            },
        },
        ui: {
            tooltip: {
                fontFamily: "Equinor-Medium",
                fontSize: 0.7 * FONT_BASIS,
                textAlign: "left",
            },
            chipAndBadge: {
                fontFamily: "Equinor-Medium",
                fontSize: 0.75 * FONT_BASIS,
                textAlign: "center",
                lineHeight: FONT_BASIS,
            },
        },
        navigation: {
            menuTab: {
                fontFamily: "Equinor-Medium",
                fontSize: FONT_BASIS,
                letterSpacing: 0.2,
            },
        },
    },
    timing: {
        animation: {
            slow: 250,
            normal: 100,
            fast: 50,
        },
    },
};
