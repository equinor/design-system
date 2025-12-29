// Color tokens sourced from @equinor/eds-tokens + custom tokens
// Matches masterToken.colors structure while sourcing from EDS where possible

import { colors } from "./colors";
import { EDSSemanticJson } from "./edsTokenTypes";
import { ColorToken } from "./types";

/* eslint-disable @typescript-eslint/no-require-imports */
const lightSemanticJson =
    require("@equinor/eds-tokens/build/json/color/color-scheme/nested/light-semantic.json") as EDSSemanticJson;
const darkSemanticJson =
    require("@equinor/eds-tokens/build/json/color/color-scheme/nested/dark-semantic.json") as EDSSemanticJson;
/* eslint-enable @typescript-eslint/no-require-imports */

// EDS Background tokens (camelCase accessors)
const edsBg = {
    neutral: {
        canvas: {
            light: lightSemanticJson.Bg.Neutral.Canvas,
            dark: darkSemanticJson.Bg.Neutral.Canvas,
        },
        surface: {
            light: lightSemanticJson.Bg.Neutral.Surface,
            dark: darkSemanticJson.Bg.Neutral.Surface,
        },
        fillMuted: {
            default: {
                light: lightSemanticJson.Bg.Neutral["Fill Muted"].Default,
                dark: darkSemanticJson.Bg.Neutral["Fill Muted"].Default,
            },
            hover: {
                light: lightSemanticJson.Bg.Neutral["Fill Muted"].Hover,
                dark: darkSemanticJson.Bg.Neutral["Fill Muted"].Hover,
            },
            active: {
                light: lightSemanticJson.Bg.Neutral["Fill Muted"].Active,
                dark: darkSemanticJson.Bg.Neutral["Fill Muted"].Active,
            },
        },
        fillEmphasis: {
            default: {
                light: lightSemanticJson.Bg.Neutral["Fill Emphasis"].Default,
                dark: darkSemanticJson.Bg.Neutral["Fill Emphasis"].Default,
            },
            hover: {
                light: lightSemanticJson.Bg.Neutral["Fill Emphasis"].Hover,
                dark: darkSemanticJson.Bg.Neutral["Fill Emphasis"].Hover,
            },
            active: {
                light: lightSemanticJson.Bg.Neutral["Fill Emphasis"].Active,
                dark: darkSemanticJson.Bg.Neutral["Fill Emphasis"].Active,
            },
        },
    },
    warning: {
        canvas: {
            light: lightSemanticJson.Bg.Warning.Canvas,
            dark: darkSemanticJson.Bg.Warning.Canvas,
        },
        surface: {
            light: lightSemanticJson.Bg.Warning.Surface,
            dark: darkSemanticJson.Bg.Warning.Surface,
        },
        fillMuted: {
            default: {
                light: lightSemanticJson.Bg.Warning["Fill Muted"].Default,
                dark: darkSemanticJson.Bg.Warning["Fill Muted"].Default,
            },
        },
        fillEmphasis: {
            default: {
                light: lightSemanticJson.Bg.Warning["Fill Emphasis"].Default,
                dark: darkSemanticJson.Bg.Warning["Fill Emphasis"].Default,
            },
        },
    },
    success: {
        fillEmphasis: {
            default: {
                light: lightSemanticJson.Bg.Success["Fill Emphasis"].Default,
                dark: darkSemanticJson.Bg.Success["Fill Emphasis"].Default,
            },
        },
    },
    danger: {
        fillEmphasis: {
            default: {
                light: lightSemanticJson.Bg.Danger["Fill Emphasis"].Default,
                dark: darkSemanticJson.Bg.Danger["Fill Emphasis"].Default,
            },
        },
    },
};

// EDS Border tokens (camelCase accessors)
const edsBorder = {
    neutral: {
        subtle: {
            light: lightSemanticJson.Border.Neutral.Subtle,
            dark: darkSemanticJson.Border.Neutral.Subtle,
        },
        medium: {
            light: lightSemanticJson.Border.Neutral.Medium,
            dark: darkSemanticJson.Border.Neutral.Medium,
        },
        strong: {
            light: lightSemanticJson.Border.Neutral.Strong,
            dark: darkSemanticJson.Border.Neutral.Strong,
        },
    },
    warning: {
        subtle: {
            light: lightSemanticJson.Border.Warning.Subtle,
            dark: darkSemanticJson.Border.Warning.Subtle,
        },
    },
};

// EDS Text tokens (camelCase accessors)
const edsText = {
    neutral: {
        subtle: {
            light: lightSemanticJson.Text.Neutral.Subtle,
            dark: darkSemanticJson.Text.Neutral.Subtle,
        },
        strong: {
            light: lightSemanticJson.Text.Neutral.Strong,
            dark: darkSemanticJson.Text.Neutral.Strong,
        },
        subtleOnEmphasis: {
            light: lightSemanticJson.Text.Neutral["Subtle on emphasis"],
            dark: darkSemanticJson.Text.Neutral["Subtle on emphasis"],
        },
        strongOnEmphasis: {
            light: lightSemanticJson.Text.Neutral["Strong on emphasis"],
            dark: darkSemanticJson.Text.Neutral["Strong on emphasis"],
        },
    },
    danger: {
        strong: {
            light: lightSemanticJson.Text.Danger.Strong,
            dark: darkSemanticJson.Text.Danger.Strong,
        },
        subtle: {
            light: lightSemanticJson.Text.Danger.Subtle,
            dark: darkSemanticJson.Text.Danger.Subtle,
        },
    },
    warning: {
        strong: {
            light: lightSemanticJson.Text.Warning.Strong,
            dark: darkSemanticJson.Text.Warning.Strong,
        },
    },
};

// =============================================================================
// Color tokens matching masterToken.colors structure
// Using EDS tokens where possible + custom tokens for gaps
// =============================================================================

export const colorToken: ColorToken = {
    // Border colors - using EDS neutral borders
    border: {
        lighter: edsBorder.neutral.subtle, // EDS subtle border
        light: edsBorder.neutral.subtle, // EDS subtle border (same as lighter)
        medium: edsBorder.neutral.medium, // EDS medium border
    },

    // Container colors - mix of EDS + custom
    container: {
        background: edsBg.neutral.surface, // EDS neutral surface
        default: edsBg.neutral.canvas, // EDS neutral canvas
        warning: edsBg.warning.surface, // EDS warning surface
        elevation: {
            // Custom elevation colors (no EDS equivalent)
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

        // TODO same color for dark mode?
        scrim: {
            light: colors.ui_background_light_scrim,
            dark: colors.ui_background_light_scrim,
        },
    },

    // Interactive colors - EDS semantic where appropriate + custom for brand colors
    interactive: {
        primary: {
            light: colors.interactive_primary_light_resting,
            dark: colors.interactive_primary_dark_resting,
        }, // Custom brand
        secondary: {
            light: colors.interactive_secondary_light_resting,
            dark: colors.interactive_secondary_dark_resting,
        }, // Custom brand
        success: edsBg.success.fillEmphasis.default, // EDS semantic success
        warning: edsBg.warning.fillEmphasis.default, // EDS semantic warning
        danger: edsBg.danger.fillEmphasis.default, // EDS semantic danger

        disabled: {
            light: colors.interactive_disabled_light_fill,
            dark: colors.interactive_disabled_dark_fill,
        }, // Custom
        pressedOverlay: {
            light: colors.interactive_pressed_overlay_light,
            dark: colors.interactive_pressed_overlay_dark,
        }, // Custom
        selectedHighlight: {
            light: colors.interactive_primary_light_selected_highlight,
            dark: colors.interactive_primary_dark_selected_highlight,
        }, // Custom brand
    },

    // Feedback colors - using EDS semantic colors
    feedback: {
        success: edsBg.success.fillEmphasis.default, // EDS semantic success
        warning: edsBg.warning.fillEmphasis.default, // EDS semantic warning
        danger: edsBg.danger.fillEmphasis.default, // EDS semantic danger
    },

    // Environment colors - custom for dev/test/qa indicators + EDS text
    environment: {
        dev: {
            light: colors.infographic_primary_energy_red_100,
            dark: colors.infographic_primary_energy_red_34,
        }, // Custom indicators
        test: {
            light: colors.infographic_primary_spruce_wood,
            dark: colors.feedback_warning_dark_hover,
        }, // Custom indicators
        qa: {
            light: colors.infographic_primary_moss_green_21,
            dark: colors.infographic_primary_moss_green_34,
        }, // Custom indicators
        text: edsText.neutral.strong, // EDS neutral text
    },

    // Text colors - EDS semantic where appropriate + custom for specific cases
    text: {
        primary: edsText.neutral.strong, // EDS primary text
        secondary: edsText.neutral.subtle, // EDS secondary text
        tertiary: {
            light: colors.text_and_static_icons_light_tertiary,
            dark: colors.text_and_static_icons_dark_tertiary,
        }, // Custom (no EDS tertiary)
        primaryInverted: edsText.neutral.strongOnEmphasis, // EDS inverted text
        disabled: {
            light: colors.interactive_disabled_light_text,
            dark: colors.interactive_disabled_dark_text,
        }, // Custom
        danger: edsText.danger.strong, // EDS semantic danger text
        menu: {
            resting: edsText.neutral.strong, // EDS neutral text
            active: {
                light: colors.interactive_primary_light_resting,
                dark: colors.interactive_primary_dark_resting,
            }, // Custom brand
        },
        feedbackWarning: edsText.warning.strong, // EDS semantic warning text
    },

    // Toast colors - custom from colors.ts
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
    },
};
