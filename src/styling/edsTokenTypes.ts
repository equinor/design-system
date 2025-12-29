// Type definitions for EDS semantic tokens JSON structure

export type EDSFillState = {
    Default: string;
    Hover: string;
    Active: string;
};

export type EDSBgVariant = {
    Canvas: string;
    Surface: string;
    "Fill Muted": EDSFillState;
    "Fill Emphasis": EDSFillState;
};

export type EDSBorderVariant = {
    Subtle: string;
    Medium: string;
    Strong: string;
};

export type EDSTextVariant = {
    Subtle: string;
    Strong: string;
    "Subtle on emphasis": string;
    "Strong on emphasis": string;
};

export type EDSSemanticJson = {
    Bg: {
        Neutral: EDSBgVariant;
        Accent: EDSBgVariant;
        Success: EDSBgVariant;
        Info: EDSBgVariant;
        Warning: EDSBgVariant;
        Danger: EDSBgVariant;
    };
    Border: {
        Neutral: EDSBorderVariant;
        Accent: EDSBorderVariant;
        Success: EDSBorderVariant;
        Info: EDSBorderVariant;
        Warning: EDSBorderVariant;
        Danger: EDSBorderVariant;
    };
    Text: {
        Neutral: EDSTextVariant;
        Accent: EDSTextVariant;
        Success: EDSTextVariant;
        Info: EDSTextVariant;
        Warning: EDSTextVariant;
        Danger: EDSTextVariant;
    };
};
