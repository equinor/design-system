import { colors } from "./colors";
import { MasterToken } from "./types";
import { FONT_BASIS, spacings } from "./values";

export const masterToken: MasterToken = {
    colors: {
        border: {
            lighter: {
                light: colors.ui_background_light_default,
                dark: colors.ui_background_dark_default,
            },
            light: {
                light: colors.ui_background_light_light,
                dark: colors.ui_background_dark_default,
            },
            medium: {
                light: colors.ui_background_light_medium,
                dark: colors.ui_background_dark_temporary_nav,
            },
        },
        container: {
            background: {
                light: colors.ui_background_light_light,
                dark: colors.ui_background_dark_light,
            },
            default: {
                light: colors.ui_background_light_default,
                dark: colors.ui_background_dark_default,
            },
            warning: {
                light: colors.ui_background_light_warning,
                dark: colors.ui_background_dark_warning,
            },
            elevation: {
                none: {
                    light: colors.ui_background_light_default,
                    dark: colors.ui_background_dark_none_plus_above_scrim,
                },
                aboveScrim: {
                    light: colors.ui_background_light_default,
                    dark: colors.ui_background_dark_none_plus_above_scrim,
                },
                raised: {
                    light: colors.ui_background_light_default,
                    dark: colors.ui_background_dark_raised,
                },
                overlay: {
                    light: colors.ui_background_light_default,
                    dark: colors.ui_background_dark_overlay,
                },
                sticky: {
                    light: colors.ui_background_light_default,
                    dark: colors.ui_background_dark_sticky,
                },
                temporaryNav: {
                    light: colors.ui_background_light_default,
                    dark: colors.ui_background_dark_temporary_nav,
                },
            },
            scrim: {
                light: "rgba(0,0,0,0.4)",
                // TODO same color for dark mode?
                dark: "rgba(0,0,0,0.4)",
            },
        },
        interactive: {
            primary: {
                light: colors.interactive_primary_light_resting,
                dark: colors.interactive_primary_dark_resting,
            },
            secondary: {
                light: colors.interactive_secondary_light_resting,
                dark: colors.interactive_secondary_dark_resting,
            },
            success: {
                light: colors.feedback_success_light_resting,
                dark: colors.feedback_success_dark_resting,
            },
            warning: {
                light: colors.feedback_warning_light_resting,
                dark: colors.feedback_warning_dark_resting,
            },
            danger: {
                light: colors.feedback_danger_light_resting,
                dark: colors.feedback_danger_dark_resting,
            },
            disabled: {
                light: colors.interactive_disabled_light_fill,
                dark: colors.interactive_disabled_dark_fill,
            },
            pressedOverlay: {
                light: "rgba(0,0,0,0.2)",
                dark: "rgba(255,255,255,0.2)",
            },
            selectedHighlight: {
                light: colors.interactive_primary_light_selected_highlight,
                dark: colors.interactive_primary_dark_selected_highlight,
            },
        },
        feedback: {
            success: {
                light: colors.feedback_success_light_resting,
                dark: colors.feedback_success_dark_resting,
            },
            warning: {
                light: colors.feedback_warning_light_resting,
                dark: colors.feedback_warning_dark_resting,
            },
            danger: {
                light: colors.feedback_danger_light_resting,
                dark: colors.feedback_danger_dark_resting,
            },
        },
        environment: {
            dev: {
                light: colors.infographic_primary_energy_red_21,
                dark: colors.infographic_primary_energy_red_34,
            },
            test: {
                light: colors.infographic_primary_spruce_wood,
                dark: colors.feedback_warning_dark_hover,
            },
            qa: {
                light: colors.infographic_primary_moss_green_21,
                dark: colors.infographic_primary_moss_green_34,
            },
            text: {
                light: colors.text_and_static_icons_light_default,
                dark: colors.text_and_static_icons_dark_primary_black,
            },
        },
        text: {
            primary: {
                light: colors.text_and_static_icons_light_default,
                dark: colors.text_and_static_icons_dark_primary,
            },
            secondary: {
                light: colors.text_and_static_icons_light_secondary,
                dark: colors.text_and_static_icons_dark_secondary,
            },
            tertiary: {
                light: colors.text_and_static_icons_light_tertiary,
                dark: colors.text_and_static_icons_dark_tertiary,
            },
            primaryInverted: {
                light: colors.text_and_static_icons_light_primary_white,
                dark: colors.text_and_static_icons_dark_primary_black,
            },
            menu: {
                resting: {
                    light: colors.text_and_static_icons_light_default,
                    dark: colors.text_and_static_icons_dark_secondary,
                },
                active: {
                    light: colors.interactive_primary_light_resting,
                    dark: colors.interactive_primary_dark_resting,
                },
            },
            danger: {
                light: colors.feedback_danger_light_text,
                dark: colors.feedback_danger_dark_text,
            },
            disabled: {
                light: colors.interactive_disabled_light_text,
                dark: colors.interactive_disabled_dark_text,
            },
            feedbackWarning: {
                light: colors.feedback_warning_light_text,
                dark: colors.feedback_warning_dark_text,
            },
        },
        toast: {
            error: {
                background: {
                    light: colors.toast_error_background_light,
                    dark: colors.toast_error_background_dark,
                },
                text: {
                    light: colors.toast_error_text_light,
                    dark: colors.toast_error_text_dark,
                },
            },
            info: {
                background: {
                    light: colors.toast_info_background_light,
                    dark: colors.toast_info_background_dark,
                },
                text: {
                    light: colors.toast_info_text_light,
                    dark: colors.toast_info_text_dark,
                },
            },
            warning: {
                background: {
                    light: colors.toast_warning_background_light,
                    dark: colors.toast_warning_background_dark,
                },
                text: {
                    light: colors.toast_warning_text_light,
                    dark: colors.toast_warning_text_dark,
                },
            },
            success: {
                background: {
                    light: colors.toast_success_background_light,
                    dark: colors.toast_success_background_dark,
                },
                text: {
                    light: colors.toast_success_text_light,
                    dark: colors.toast_success_text_dark,
                },
            },
        },
    },
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
                    tablet: spacings.xx_large,
                    phone: spacings.xx_large,
                },
            },
            cell: {
                minHeight: 30,
                navigation: {
                    height: {
                        tablet: 60,
                        phone: 60,
                    },
                },
                accordion: {
                    height: {
                        tablet: 40,
                        phone: 32,
                    },
                },
                adornment: {
                    widthSmall: {
                        tablet: 40,
                        phone: 32,
                    },
                    widthMedium: {
                        tablet: 56,
                        phone: 48,
                    },
                    widthLarge: {
                        tablet: 96,
                        phone: 88,
                    },
                },
            },
            dialog: {
                minHeight: {
                    tablet: 213,
                    phone: 213,
                },
                defaultWidth: {
                    phone: 500,
                    tablet: 500,
                },
                header: {
                    height: {
                        tablet: 50,
                        phone: 50,
                    },
                },
            },
            tabs: {
                minWidth: {
                    tablet: spacings.xxx_large,
                    phone: spacings.x_large,
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
                tablet: spacings.x_large,
                phone: spacings.large,
            },
            paddingVertical: {
                tablet: spacings.medium,
                phone: spacings.medium,
            },
        },
        dialog: {
            padding: {
                tablet: spacings.medium,
                phone: spacings.medium,
            },
            gap: {
                tablet: spacings.medium,
                phone: spacings.medium,
            },
        },
        element: {
            paddingHorizontal: {
                tablet: spacings.medium_small,
                phone: spacings.small,
            },
            paddingVertical: {
                tablet: spacings.small,
                phone: spacings.small,
            },
        },
        chip: {
            paddingHorizontal: {
                tablet: spacings.small,
                phone: spacings.small,
            },
            paddingVertical: {
                tablet: spacings.x_small,
                phone: spacings.x_small,
            },
        },
        button: {
            paddingHorizontal: {
                tablet: spacings.medium,
                phone: spacings.medium_small,
            },
            paddingVertical: {
                tablet: spacings.small,
                phone: spacings.small,
            },
            iconGap: {
                tablet: spacings.small,
                phone: spacings.small,
            },
        },
        textField: {
            paddingHorizontal: {
                tablet: spacings.medium_small,
                phone: spacings.small,
            },
            paddingVertical: {
                tablet: spacings.small,
                phone: spacings.small,
            },
        },
        menu: {
            paddingVertical: {
                tablet: spacings.small,
                phone: spacings.small,
            },
            item: {
                paddingVertical: {
                    tablet: spacings.medium_small,
                    phone: spacings.medium_small,
                },
                paddingHorizontal: {
                    tablet: spacings.large,
                    phone: spacings.large,
                },
                iconGap: {
                    tablet: spacings.medium,
                    phone: spacings.medium_small,
                },
            },
        },
        cell: {
            group: {
                titleBottomPadding: {
                    tablet: spacings.medium_small,
                    phone: spacings.small,
                },
            },
            content: {
                titleDescriptionGap: {
                    tablet: spacings.small,
                    phone: spacings.small,
                },
            },
            paddingVertical: {
                tablet: spacings.large,
                phone: spacings.medium,
            },
            gapHorizontal: {
                tablet: spacings.large,
                phone: spacings.medium,
            },
        },
        spacer: {
            small: {
                tablet: 20,
                phone: 12,
            },
            medium: {
                tablet: 30,
                phone: 22,
            },
            large: {
                tablet: 42,
                phone: 34,
            },
        },
        tabs: {
            paddingVerical: {
                tablet: spacings.medium,
                phone: spacings.medium,
            },
            paddingHorizontal: {
                tablet: spacings.medium,
                phone: spacings.medium,
            },
        },
    },
    typography: {
        paragraph: {
            body_short: {
                fontFamily: "Equinor-Regular",
                fontSize: FONT_BASIS,
                lineHeight: FONT_BASIS * 1.25,
                textAlign: "left",
            },
            body_long: {
                fontFamily: "Equinor-Regular",
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
                fontFamily: "Equinor-Regular",
                fontSize: FONT_BASIS * 0.825,
                lineHeight: FONT_BASIS,
                textAlign: "left",
            },
        },
        basic: {
            h1: {
                fontFamily: "Equinor-Regular",
                fontSize: 2 * FONT_BASIS,
                lineHeight: 2 * FONT_BASIS * 1.25,
                textAlign: "left",
            },
            h2: {
                fontFamily: "Equinor-Regular",
                fontSize: 1.75 * FONT_BASIS,
                textAlign: "left",
            },
            h3: {
                fontFamily: "Equinor-Regular",
                fontSize: 1.5 * FONT_BASIS,
                textAlign: "left",
            },
            h4: {
                fontFamily: "Equinor-Regular",
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
                fontFamily: "Equinor-Regular",
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
                fontFamily: "Equinor-Regular",
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
                fontFamily: "Equinor-Regular",
                lineHeight: 1.5 * FONT_BASIS,
                fontSize: FONT_BASIS,
                color: colors.interactive_primary_light_resting,
                textDecorationLine: "underline",
                textAlign: "left",
            },
        },
        cell: {
            groupTitle: {
                fontFamily: "Equinor-Regular",
                fontSize: 0.875 * FONT_BASIS,
                textAlign: "left",
                textTransform: "uppercase",
            },
            title: {
                fontFamily: "Equinor-Regular",
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
