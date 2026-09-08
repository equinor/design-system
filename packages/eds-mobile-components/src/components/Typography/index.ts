import {
    TypographyHeader,
    type TypographyHeaderProps,
} from "./TypographyHeader";
import { TypographyUI, type TypographyUIProps } from "./TypographyUI";

type ExtendedTypography = typeof TypographyUI & {
    /**
     * Header typography variant, used for titles and headings.
     */
    Header: typeof TypographyHeader;
};

const Typography = TypographyUI as ExtendedTypography;
Typography.Header = TypographyHeader;

export { Typography };
export type { TypographyHeaderProps, TypographyUIProps };
