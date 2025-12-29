// Color tokens sourced from @equinor/eds-tokens + custom tokens
// Matches masterToken.colors structure while sourcing from EDS where possible

import { colors } from "./colors";
import {
    darkSemantic as darkSemanticJson,
    lightSemantic as lightSemanticJson,
} from "./edsSemanticTokens.generated";
import { ColorToken } from "./types";

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
        canvas: {
            light: lightSemanticJson.Bg.Success.Canvas,
            dark: darkSemanticJson.Bg.Success.Canvas,
        },
        surface: {
            light: lightSemanticJson.Bg.Success.Surface,
            dark: darkSemanticJson.Bg.Success.Surface,
        },
        fillMuted: {
            default: {
                light: lightSemanticJson.Bg.Success["Fill Muted"].Default,
                dark: darkSemanticJson.Bg.Success["Fill Muted"].Default,
            },
        },
        fillEmphasis: {
            default: {
                light: lightSemanticJson.Bg.Success["Fill Emphasis"].Default,
                dark: darkSemanticJson.Bg.Success["Fill Emphasis"].Default,
            },
        },
    },
    info: {
        canvas: {
            light: lightSemanticJson.Bg.Info.Canvas,
            dark: darkSemanticJson.Bg.Info.Canvas,
        },
        surface: {
            light: lightSemanticJson.Bg.Info.Surface,
            dark: darkSemanticJson.Bg.Info.Surface,
        },
        fillMuted: {
            default: {
                light: lightSemanticJson.Bg.Info["Fill Muted"].Default,
                dark: darkSemanticJson.Bg.Info["Fill Muted"].Default,
            },
        },
        fillEmphasis: {
            default: {
                light: lightSemanticJson.Bg.Info["Fill Emphasis"].Default,
                dark: darkSemanticJson.Bg.Info["Fill Emphasis"].Default,
            },
        },
    },
    danger: {
        canvas: {
            light: lightSemanticJson.Bg.Danger.Canvas,
            dark: darkSemanticJson.Bg.Danger.Canvas,
        },
        surface: {
            light: lightSemanticJson.Bg.Danger.Surface,
            dark: darkSemanticJson.Bg.Danger.Surface,
        },
        fillMuted: {
            default: {
                light: lightSemanticJson.Bg.Danger["Fill Muted"].Default,
                dark: darkSemanticJson.Bg.Danger["Fill Muted"].Default,
            },
        },
        fillEmphasis: {
            default: {
                light: lightSemanticJson.Bg.Danger["Fill Emphasis"].Default,
                dark: darkSemanticJson.Bg.Danger["Fill Emphasis"].Default,
            },
        },
    },
    accent: {
        canvas: {
            light: lightSemanticJson.Bg.Accent.Canvas,
            dark: darkSemanticJson.Bg.Accent.Canvas,
        },
        surface: {
            light: lightSemanticJson.Bg.Accent.Surface,
            dark: darkSemanticJson.Bg.Accent.Surface,
        },
        fillMuted: {
            default: {
                light: lightSemanticJson.Bg.Accent["Fill Muted"].Default,
                dark: darkSemanticJson.Bg.Accent["Fill Muted"].Default,
            },
        },
        fillEmphasis: {
            default: {
                light: lightSemanticJson.Bg.Accent["Fill Emphasis"].Default,
                dark: darkSemanticJson.Bg.Accent["Fill Emphasis"].Default,
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
    accent: {
        subtle: {
            light: lightSemanticJson.Border.Accent.Subtle,
            dark: darkSemanticJson.Border.Accent.Subtle,
        },
        medium: {
            light: lightSemanticJson.Border.Accent.Medium,
            dark: darkSemanticJson.Border.Accent.Medium,
        },
        strong: {
            light: lightSemanticJson.Border.Accent.Strong,
            dark: darkSemanticJson.Border.Accent.Strong,
        },
    },
    success: {
        subtle: {
            light: lightSemanticJson.Border.Success.Subtle,
            dark: darkSemanticJson.Border.Success.Subtle,
        },
        medium: {
            light: lightSemanticJson.Border.Success.Medium,
            dark: darkSemanticJson.Border.Success.Medium,
        },
        strong: {
            light: lightSemanticJson.Border.Success.Strong,
            dark: darkSemanticJson.Border.Success.Strong,
        },
    },
    info: {
        subtle: {
            light: lightSemanticJson.Border.Info.Subtle,
            dark: darkSemanticJson.Border.Info.Subtle,
        },
        medium: {
            light: lightSemanticJson.Border.Info.Medium,
            dark: darkSemanticJson.Border.Info.Medium,
        },
        strong: {
            light: lightSemanticJson.Border.Info.Strong,
            dark: darkSemanticJson.Border.Info.Strong,
        },
    },
    warning: {
        subtle: {
            light: lightSemanticJson.Border.Warning.Subtle,
            dark: darkSemanticJson.Border.Warning.Subtle,
        },
        medium: {
            light: lightSemanticJson.Border.Warning.Medium,
            dark: darkSemanticJson.Border.Warning.Medium,
        },
        strong: {
            light: lightSemanticJson.Border.Warning.Strong,
            dark: darkSemanticJson.Border.Warning.Strong,
        },
    },
    danger: {
        subtle: {
            light: lightSemanticJson.Border.Danger.Subtle,
            dark: darkSemanticJson.Border.Danger.Subtle,
        },
        medium: {
            light: lightSemanticJson.Border.Danger.Medium,
            dark: darkSemanticJson.Border.Danger.Medium,
        },
        strong: {
            light: lightSemanticJson.Border.Danger.Strong,
            dark: darkSemanticJson.Border.Danger.Strong,
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
    accent: {
        subtle: {
            light: lightSemanticJson.Text.Accent.Subtle,
            dark: darkSemanticJson.Text.Accent.Subtle,
        },
        strong: {
            light: lightSemanticJson.Text.Accent.Strong,
            dark: darkSemanticJson.Text.Accent.Strong,
        },
        subtleOnEmphasis: {
            light: lightSemanticJson.Text.Accent["Subtle on emphasis"],
            dark: darkSemanticJson.Text.Accent["Subtle on emphasis"],
        },
        strongOnEmphasis: {
            light: lightSemanticJson.Text.Accent["Strong on emphasis"],
            dark: darkSemanticJson.Text.Accent["Strong on emphasis"],
        },
    },
    success: {
        subtle: {
            light: lightSemanticJson.Text.Success.Subtle,
            dark: darkSemanticJson.Text.Success.Subtle,
        },
        strong: {
            light: lightSemanticJson.Text.Success.Strong,
            dark: darkSemanticJson.Text.Success.Strong,
        },
        subtleOnEmphasis: {
            light: lightSemanticJson.Text.Success["Subtle on emphasis"],
            dark: darkSemanticJson.Text.Success["Subtle on emphasis"],
        },
        strongOnEmphasis: {
            light: lightSemanticJson.Text.Success["Strong on emphasis"],
            dark: darkSemanticJson.Text.Success["Strong on emphasis"],
        },
    },
    info: {
        subtle: {
            light: lightSemanticJson.Text.Info.Subtle,
            dark: darkSemanticJson.Text.Info.Subtle,
        },
        strong: {
            light: lightSemanticJson.Text.Info.Strong,
            dark: darkSemanticJson.Text.Info.Strong,
        },
        subtleOnEmphasis: {
            light: lightSemanticJson.Text.Info["Subtle on emphasis"],
            dark: darkSemanticJson.Text.Info["Subtle on emphasis"],
        },
        strongOnEmphasis: {
            light: lightSemanticJson.Text.Info["Strong on emphasis"],
            dark: darkSemanticJson.Text.Info["Strong on emphasis"],
        },
    },
    warning: {
        subtle: {
            light: lightSemanticJson.Text.Warning.Subtle,
            dark: darkSemanticJson.Text.Warning.Subtle,
        },
        strong: {
            light: lightSemanticJson.Text.Warning.Strong,
            dark: darkSemanticJson.Text.Warning.Strong,
        },
        subtleOnEmphasis: {
            light: lightSemanticJson.Text.Warning["Subtle on emphasis"],
            dark: darkSemanticJson.Text.Warning["Subtle on emphasis"],
        },
        strongOnEmphasis: {
            light: lightSemanticJson.Text.Warning["Strong on emphasis"],
            dark: darkSemanticJson.Text.Warning["Strong on emphasis"],
        },
    },
    danger: {
        subtle: {
            light: lightSemanticJson.Text.Danger.Subtle,
            dark: darkSemanticJson.Text.Danger.Subtle,
        },
        strong: {
            light: lightSemanticJson.Text.Danger.Strong,
            dark: darkSemanticJson.Text.Danger.Strong,
        },
        subtleOnEmphasis: {
            light: lightSemanticJson.Text.Danger["Subtle on emphasis"],
            dark: darkSemanticJson.Text.Danger["Subtle on emphasis"],
        },
        strongOnEmphasis: {
            light: lightSemanticJson.Text.Danger["Strong on emphasis"],
            dark: darkSemanticJson.Text.Danger["Strong on emphasis"],
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

    // Toast colors - using EDS semantic colors
    // Background: Using Fill Muted for subtle background on toasts
    // Text: Using Text.*.Subtle for readable text on muted backgrounds
    toast: {
        error: {
            background: edsBg.danger.fillMuted.default, // EDS danger fill muted
            text: edsText.danger.subtle, // EDS danger text subtle
        },
        success: {
            background: edsBg.success.fillMuted.default, // EDS success fill muted
            text: edsText.success.subtle, // EDS success text subtle
        },
        info: {
            background: edsBg.info.fillMuted.default, // EDS info fill muted
            text: edsText.info.subtle, // EDS info text subtle
        },
        warning: {
            background: edsBg.warning.fillMuted.default, // EDS warning fill muted
            text: edsText.warning.subtle, // EDS warning text subtle
        },
    },
};
